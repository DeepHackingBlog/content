---
id: "anatomia-del-formato-portable-executable"
title: "Anatomy of the Portable Executable (PE) Format"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2024-10-29
updatedDate: 2024-10-29
image: "https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-0.webp"
description: "Discover the internal structure of the Windows PE format: DOS headers, NT Headers, sections and data directories for malware development and analysis."
categories:
  - "windows"
draft: false
featured: false
lang: "en"
---

In Windows systems we can find countless extensions, although mainly .exe, .dll, .sys, among others, stand out. All these extensions have something in common: they follow the PE (Portable Executable) format. The PE format is the standard used by Windows for executable files and dynamic link libraries (DLLs), allowing the system to load and execute programs efficiently.

This format is an extension of the COFF format, which was originally developed to store object files in Unix systems. Microsoft adapted and extended COFF to create the PE format to handle the specific needs of executables and libraries in Windows.

![PE executable files in Windows: EXE, DLL, SYS](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-1.avif)

In today's article we will explain how this format is structured. We will use a simple C executable that prints a Hello World, all the screenshots in this article will belong to this executable.

To begin, we can observe a basic high-level structure of a PE file in the following image:

![Basic structure of a PE file at high level](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-2.avif)

We are going to talk in detail about each of these headers. If for example, we open our executable using the [PE-Bear](https://github.com/hasherezade/pe-bear) tool, we will be able to visualize all the fields from the image above:

![Visualization of PE headers in PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-3.avif)

That said, let's start by looking at some important concepts and then we will see each part of the PE format one by one.

- [Glossary of Terms](#glossary-of-terms)
- [Loader and Linker](#loader-and-linker)
- [Relative Virtual Address (RVA)](#relative-virtual-address-rva)
- [Sections](#sections)
- [winnt.h](#winnth)
- [DOS Header](#dos-header)
- [DOS Stub](#dos-stub)
- [Rich Header](#rich-header)
- [Difference in Execution Flow Between a Windows System and MS-DOS](#difference-in-execution-flow-between-a-windows-system-and-ms-dos)
- [NT Headers (IMAGE_NT_HEADERS)](#nt-headers-image_nt_headers)
    - [PE Signature](#pe-signature)
    - [File Header (IMAGE_FILE_HEADER)](#file-header-image_file_header)
    - [Optional Header (IMAGE_OPTIONAL_HEADER)](#optional-header-image_optional_header)
        - [Data Directories (IMAGE_DATA_DIRECTORY)](#data-directories-image_data_directory)
            - [Export Directory](#export-directory)
            - [Import Address Table (IAT)](#import-address-table-iat)
- [Section Headers](#section-headers)
- [Conclusion](#conclusion)
- [References](#references)

## Glossary of Terms

Throughout the article we are going to see many terms that may be worth knowing beforehand. Anyway, when these terms are used they will be reminded of what they are about, but at least this way we have them in a centralized manner:

- **PE32**: 32-bit portable executable file.
- **PE32+**: 64-bit portable executable file.
- **BYTE**: One byte of data (also known as DB).
- **WORD**: Two bytes of data (also known as DW).
- **DWORD**: Four bytes of data (also known as DD).
- **Section**: Sections are the containers of executable file data. Each PE file can have multiple sections, and each one has a specific name and attributes that determine how the operating system should handle it.
- **Object file**: It is the result of the assembler or compiler and is usually in _**COFF** (Common Object File Format)_. These files serve as input for the _linker_.
- **Image file**: It is the result of the linker and is called an image file. It can be an executable file (.exe) or a dynamic link library (.dll). The PE _(Portable Executable)_ format is an extension of the COFF format and is the standard for executable files and DLLs on Windows systems.
- **Binary file**: A binary file can be an object file or an image file.
- **Windows Loader** (or simply _**loader**_): It is the code responsible for loading a PE file into memory. When a PE file is loaded into memory, its in-memory version is called a **module**.
- **Offset**: It is a reference to the position of data or an instruction within a file or in memory. The offset indicates how many bytes you need to advance from an initial position, such as the start of a file or a memory segment, to reach a specific location. In PE files, it is used to indicate the position of different sections or components within the file.
- **Mapping**: In the context of operating systems and executable files, "mapping" means assigning parts of a file directly to the system's memory so they can be used by a program. It's like creating a link between the file content on disk and a specific area of memory, allowing the program to access that information quickly and efficiently. In the case of PE (Portable Executable) files, the Windows loader takes the sections of the executable file and places them in memory. This establishes a correspondence between the positions of the file on disk and the addresses in memory. Thanks to this process, the program can directly access its necessary instructions and data during execution, without having to load the entire file into memory at once.
- **NT Headers**: Sometimes NT headers are also known as PE headers, so if you see PE Header instead of NT Header out there, know that it refers to the same thing.

Additionally, for the article we will make the respective translations, that is, _OS loader_ we will mention it as operating system loader, _linker_ as linker, etc. Finally, we will refer to executable files (.exe, .dll) as image files, likewise, when we refer to PE file, we will be including both object files and image files.

## Loader and Linker

When we run a program, two of the most important components in the process are the linker and the loader. The linker combines the object files generated by the compiler or assembler, along with other pieces of code, to create an executable file, such as a file with a .exe extension. This process ensures that all references between different parts of the program are correctly resolved, allowing the code to function as a unit.

The loader, on the other hand, is responsible for taking this executable file generated by the linker and loading it into the system's main memory, preparing it for the processor to execute. Without the loader, the program could not be executed, since the code must be in memory before the CPU can access it.

These two components, the linker and the loader, work together so that a program goes from being simple code to a functioning application, making them essential elements in the life cycle of a program.

![Compilation and linking process: Linker and Loader](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-4.avif)

Let's see the entire compilation process manually using the MSVC tools (cl and link), which allow us to obtain the files corresponding to each step. We will use cl to compile and generate assembler code and object file, and link to create the final executable.

Initially we have the following C++ code that prints a simple _Hello World_:

![C++ source code that prints Hello World](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-5.avif)

To obtain the assembler code from this C++ file, we use cl with the /Fa and /Fo options, which allow us to generate the assembler (.asm) and the output object file (.obj):

```bash
cl /Fahello.asm /Fohello.obj /c hello.cpp
```

![Compilation with cl generating ASM and OBJ files](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-6.avif)

This command generates a file called hello.asm that contains the assembler code of the program in ASCII format. It also generates an object file (hello.obj) that contains the corresponding machine code that can be executed by the processor. The object file is not yet an executable program by itself. Nor does it contain all the references to standard libraries or operating system functions, those references are resolved during the linking process.

![Generated files: hello.asm and hello.obj](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-7.avif)

If we pass these two files to Linux we can observe the file type using the file command:

![File command showing COFF format of ASM and OBJ files](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-8.avif)

Once we have the assembler code and the object file generated by cl, we can proceed to the next step to create the executable.

To convert the object file into a Windows executable program, we use link. This ensures that all function and library references are properly managed:

```bash
link hello.obj /OUT:hello.exe
```

![Linking object file with link to create executable](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-9.avif)

![Executable hello.exe generated by the linker](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-10.avif)

This step links the object file and generates an executable called hello.exe. The linker, which is called by the MSVC compiler, connects all the necessary function and library references so that the program can run correctly in a Windows environment.

This whole explanation has been more out of simple curiosity (and because there will be some mention throughout the article), but the important thing was to understand how the compilation and linking process converts our source code into an executable program, managing both the references to functions and libraries as well as the structure of the final file.

> The image file generated in this section is not the same as the one in the rest of the article.

## Relative Virtual Address (RVA)

Before continuing, let's look at another important concept on which PE files depend to a great extent. This is the relative virtual address (RVA), this address is basically an offset from where the image (PE file) has been loaded into memory (Image Base).

For example, if an image is loaded into memory with a base address 0x400000 and the RVA to the entry point (main function) is 0x1000. We could obtain the virtual address of the entry point by adding these two values:

- Image Base + RVA = VA
    - 0x00400000 + 0x00001000 = 0x00401000

In this way we would obtain the virtual address of the main function.

Actually, the RVA value of a method or variable does not necessarily have to always be the offset from the beginning of the file (Image Base). It is normally the relative value from a virtual address, which is commonly the base address of the image but can also be the base address of a section.

## Sections

The last important concept before starting with the PE format is that of sections. Sections are the containers of executable file data, they occupy the rest of the PE file after the headers, specifically after the section headers (which we will see at the end).

![Sections in a PE file after the headers](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-11.avif)

Some sections have special names that indicate their purpose, you can see the complete list of them in the [Microsoft official documentation on special sections](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#special-sections). Still, the most common ones are the following:

- **.text**: Contains the executable code of the program.
- **.data**: Contains initialized data.
- **.bss**: Contains uninitialized data.
- **.rdata**: Contains read-only initialized data.
- **.edata**: Contains export tables.
- **.idata**: Contains import tables.
- **.reloc**: Contains image relocation information.
- **.rsrc**: Contains resources used by the program, which can include images, icons and even embedded binaries.
- **.tls**: Provides specific storage for each thread running in the program.

![View of PE sections in PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-12.avif)

I preferred to introduce this concept at the beginning because it is mentioned more than once, but do not confuse its position, sections are the last thing found in a PE file, as we can see in the image at the beginning of the article.

## winnt.h

Throughout the article we are going to see many different definitions and data structures, the common point of all of them is that they are found in the _**winnt.h**_ header file.

This file is available in the _**mingw-w64**_ GitHub repository. All the structures and definitions that we will mention can be consulted directly in the [mingw-w64 repository on GitHub](https://github.com/Alexpux/mingw-w64/blob/master/mingw-w64-tools/widl/include/winnt.h).

## DOS Header

The DOS header (also called MS-DOS header) is a 64-byte structure that exists at the beginning of the PE file. This header is not new to the PE format, it is the same MS-DOS header that has existed since version 2 of the MS-DOS operating system. The main reason for keeping the same structure intact at the beginning of the PE format is that, when you try to load a file created under Windows version 3.1 or earlier, or MS-DOS version 2.0 or later, the operating system can read the file and understand that it is not compatible.

In other words, if you try to run a Windows NT executable on MS-DOS version 6.0, you will receive the message _"This program cannot be run in DOS mode."_.

If the MS-DOS header was not included as the first part of the PE format, the operating system would simply fail to load the file and would offer an error message like _"The name specified is not recognized as an internal or external command, operable program or batch file."_

Although it is not a header that is commonly used in modern Windows systems, it is still present for compatibility reasons with older systems. We can see the structure of this header by checking the definition of the "IMAGE\_DOS\_HEADER" structure located in the _winnt.h_ library:

```c
typedef struct _IMAGE_DOS_HEADER {      // DOS .EXE header
    WORD   e_magic;                     // Magic number
    WORD   e_cblp;                      // Bytes on last page of file
    WORD   e_cp;                        // Pages in file
    WORD   e_crlc;                      // Relocations
    WORD   e_cparhdr;                   // Size of header in paragraphs
    WORD   e_minalloc;                  // Minimum extra paragraphs needed
    WORD   e_maxalloc;                  // Maximum extra paragraphs needed
    WORD   e_ss;                        // Initial (relative) SS value
    WORD   e_sp;                        // Initial SP value
    WORD   e_csum;                      // Checksum
    WORD   e_ip;                        // Initial IP value
    WORD   e_cs;                        // Initial (relative) CS value
    WORD   e_lfarlc;                    // File address of relocation table
    WORD   e_ovno;                      // Overlay number
    WORD   e_res[4];                    // Reserved words
    WORD   e_oemid;                     // OEM identifier (for e_oeminfo)
    WORD   e_oeminfo;                   // OEM information; e_oemid specific
    WORD   e_res2[10];                  // Reserved words
    LONG   e_lfanew;                    // File address of new exe header
  } IMAGE_DOS_HEADER, *PIMAGE_DOS_HEADER;
```

Although this header is not widely used, it is true that it contains 6 bytes with important information for the operating system loader:

- **e_magic \[2-bytes/WORD\]**: This field, also called "_magic number_", is positioned right in the first 2 bytes of the PE file. These first two bytes have a fixed hexadecimal value of 0x5A4D, which translates to 'MZ' in ASCII. This value is used to identify a type of MS-DOS compatible file, and for this reason, serves as a signature to indicate that it is a valid MS-DOS executable file. As a curiosity, 'MZ' refers to [Mark Zbikowski](https://en.wikipedia.org/wiki/Mark_Zbikowski), one of the developers of MS-DOS.

<figure>

![e_magic field of the DOS Header with MZ value](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-13.avif)

<figcaption>

e_magic

</figcaption>

</figure>

- **e_lfanew \[4-bytes/DWORD\]**: This field corresponds to the last 4 bytes of the DOS header structure, starting at byte 60 (an offset of 0x3C from the base address). This field is truly important as it serves as an offset towards the NT headers. The value of these 4 bytes indicates where the NT headers start in the file, which coincides with where the "PE Signature" header begins. The NT headers are the modern successor to the DOS header and are crucial for the operating system to be able to load and execute the file correctly.

<figure>

![e_lfanew field pointing to NT headers](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-14.avif)

<figcaption>

e_lfanew

</figcaption>

</figure>

The DOS header seen from PE-Bear is as follows:

<figure>

![Complete DOS Header view in PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-15.avif)

<figcaption>

DOS Header

</figcaption>

</figure>

We can see the "e\_magic" with its fixed value and subsequently the value of "e\_lfanew" which would be 0x100, that is, following an offset of 0x100 we would find the start of the NT headers.

## DOS Stub

After the DOS header, comes the **DOS Stub** (offset of 0x40), a small MS-DOS 2.0 compatible executable. Its main function is to display an error message that says: _"This program cannot be run in DOS mode"_ when the file is attempted to run in a [DOS environment](https://en.wikipedia.org/wiki/DOS).

<figure>

![DOS Stub showing incompatibility message](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-16.avif)

<figcaption>

DOS Stub

</figcaption>

</figure>

This code is necessary to ensure compatibility with older systems and provide a friendly response instead of an unexplained failure.

## Rich Header

Once we have seen the DOS header and the _DOS Stub_ we should move on to the NT headers. However, before them, there is a possible piece of data known as the _Rich_ header that may or may not be present. It is an undocumented structure that is only present in those executables that have been created with Microsoft's toolset.

![Rich Header in PE-Bear hexadecimal view](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-17.avif)

![Rich Header details in PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-18.avif)

This header is formed by:

- **A set of data passed through XOR**.
- **The keyword** _**Rich**_ (in _PE-Bear_ it corresponds to the _Rich ID_ field).
- **An XOR key**: which on one hand serves as a _checksum_ and on the other as a key itself to decrypt the XOR data.

This structure is generated by the linker and contains some metadata about the tools used to build the executable, for example:

![Rich Header analysis with rich.py showing compiler modules](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-19.avif)

In the image we can observe the _Rich_ header analysis of our image file using [rich.py](https://github.com/RichHeaderResearch/RichPE). The script details the compilation environment, _VS2008 SP1 build 30729_ in this case. Additionally, different modules are listed through specific IDs and versions, along with a count indicating the number of times each module was used during the image construction. For example, the module with ID 259, version 33808, appears 3 times. On the other hand, the line indicating unmarked objects (_Unmarked objects count=64_) refers to sections of the executable that are not directly associated with specific compiler tools, but that are still part of the final file.

This field not only contains relevant information about the compilation environment profile, but can also be very useful to be used as a signature or _fingerprint_. The count also gives possible indications about the size of the project, and the _checksum_ can also be used as a signature.

As it contains this type of information, malware developers often modify this header to not provide this information or take advantage of this header to perform other actions. If you want to see more information I leave some links here:

- [The devil's in the Rich header](https://securelist.com/the-devils-in-the-rich-header/84348/)
- [Rich Header Research](https://github.com/RichHeaderResearch/RichPE)
- [Case studies in Rich Header analysis and hunting](http://ropgadget.com/posts/richheader_hunting.html)
- [Microsoft's Rich Signature (undocumented)](https://www.ntcore.com/files/richsign.htm)
- [PE File Rich Header](https://offwhitesecurity.dev/malware-development/portable-executable-pe/rich-header/)

## Difference in Execution Flow Between a Windows System and MS-DOS

Based on what we have seen so far, the behavior when executing an image file between both systems would be as follows:

<figure>

![Execution flow comparing Windows and MS-DOS](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-20.avif)

<figcaption>

Based on the same diagram from: A dive into the PE file format - PE file structure - Part 2: DOS Header, DOS Stub and Rich Header

</figcaption>

</figure>

## NT Headers (IMAGE\_NT\_HEADERS)

The NT headers are a structure defined in the _winnt.h_ library as "IMAGE\_NT\_HEADERS":

```c
typedef struct _IMAGE_NT_HEADERS64 {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER64 OptionalHeader;
} IMAGE_NT_HEADERS64, *PIMAGE_NT_HEADERS64;

typedef struct _IMAGE_NT_HEADERS {
    DWORD Signature;
    IMAGE_FILE_HEADER FileHeader;
    IMAGE_OPTIONAL_HEADER32 OptionalHeader;
} IMAGE_NT_HEADERS32, *PIMAGE_NT_HEADERS32;
```

If we look at its definition, we can find three members:

- **Signature \[4-bytes/DWORD\]**
- **FileHeader \[IMAGE\_FILE\_HEADER/Structure\]**
- **OptionalHeader \[IMAGE\_OPTIONAL\_HEADER/Structure\]**

Additionally, the structure is defined in two different versions, one for 32-bit executables (also referred to as PE32 executables) and another for 64 bits (referred to as PE32+). Although if we look closely, this difference is only reflected in the "OptionalHeader" member.

#### PE Signature

The PE file signature is the first member of the NT headers structure, it is a DWORD data type, so it occupies 4 bytes. We can visualize it in PE-Bear:

![PE signature with value 0x50450000 in PE-Bear](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-21.avif)

The signature always has a fixed value of 0x50450000, which translates to ASCII as PE\\0\\0 (P + E + Null Byte + Null Byte). The purpose of the signature is to serve as a mark that tells the operating system that it is indeed an executable in PE format.

#### File Header (IMAGE\_FILE\_HEADER)

This structure stores information about the PE file, it is also called "COFF file header". It is defined in _winnt.h_ as "IMAGE\_FILE\_HEADER":

```c
typedef struct _IMAGE_FILE_HEADER {
    WORD    Machine;
    WORD    NumberOfSections;
    DWORD   TimeDateStamp;
    DWORD   PointerToSymbolTable;
    DWORD   NumberOfSymbols;
    WORD    SizeOfOptionalHeader;
    WORD    Characteristics;
} IMAGE_FILE_HEADER, *PIMAGE_FILE_HEADER;
```

Let's look at each member of the structure:

- **Machine \[2-bytes/WORD\]**: Specifies the target architecture for the executable (x86, x64, ARM, etc). Although we are only interested in two, 0x8864 for AMD64 and 0x14c for i386. The complete list of values can be seen in the [Microsoft documentation on machine types](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#machine-types).
- **NumberOfSections \[2-bytes/WORD\]**: This field stores the number of sections, in other words, the number of section headers (size of the section table).
- **TimeDateStamp \[4-bytes/DWORD\]**: This value indicates the creation or compilation time of the program in the form of _epoch timestamp_ (1728682065), which measures the seconds elapsed since 01/01/1970 00:00:00. An interesting aspect to keep in mind is the risk of an _integer overflow_ in 2038 due to the limited space available in this DWORD field.
- **PointerToSymbolTable and NumberOfSymbols \[4-bytes/DWORD\]**: These two fields contain the file offset to the COFF symbol table and the number of entries in that symbol table. However they are set to 0 because COFF debugging information is obsolete in modern PE files (no COFF symbol table present).
- **SizeOfOptionalHeader \[2-bytes/WORD\]**: Stores the size of the optional header. For PE32 it is usually 0x00E0 (224 bytes) and for PE32+ it is usually 0X00F0 (240 bytes).
- **Characteristics \[2-bytes/WORD\]**: Contains _flags_ that indicate the attributes of the file. These attributes can be things like whether the file is executable, whether it is a system file and not a user program, and many other things. The complete list of attributes can be found in the [Microsoft documentation on characteristics](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#characteristics), some of them would be:
    - **0x0002**: Executable file
    - **0x0020**: The application can handle addresses greater than 2 GB
    - **0x0100**: The file is a DLL
    - **0x2000**: The file is a system file.
    - **0x4000**: The file is a loadable driver.
    - **0x8000**: The file is media-aware.

The file header of our image file would be as follows:

![File Header with architecture and executable characteristics](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-22.avif)

![File Header details in hexadecimal view](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-23.avif)

#### Optional Header (IMAGE\_OPTIONAL\_HEADER)

This header is the most important of the NT headers. The system loader will look at the information given by this header to be able to load and execute the executable. It is called optional header because some file types like object files do not have it, however, it is essential for image files. This header does not have a fixed value, that's why the "SizeOfOptionalHeader" member exists in the "IMAGE\_FILE\_HEADER" structure.

The first 8 members of the optional header are standard for each implementation of the COFF file format, the rest of the header is an extension of the standard COFF optional header defined by Microsoft, these additional members of the structure are necessary for the Windows loader and linker.

As mentioned previously, there are two versions for this header, one for 32-bit executables and another for 64. The two versions are different in two aspects:

- **The size of the structure itself (or the number of members defined within the structure)**: "IMAGE\_OPTIONAL\_HEADER32" has 31 members while "IMAGE\_OPTIONAL\_HEADER64" only has 30 members, that additional member in the 32-bit version is a DWORD called "BaseOfData" that contains the RVA of the beginning of the data section.
- **The data type of some of the members**: The following 5 members of the "IMAGE\_OPTIONAL\_HEADER" structure are defined as DWORD data type in the 32-bit version and as ULONGLONG in the 64-bit version:
    - "ImageBase"
    - "SizeOfStackReserve"
    - "SizeOfStackCommit"
    - "SizeOfHeapReserve"
    - "SizeOfHeapCommit"

Let's see the definition of both structures:

- 32 bits

```c
typedef struct _IMAGE_OPTIONAL_HEADER {
    //
    // Standard fields.
    //

    WORD    Magic;
    BYTE    MajorLinkerVersion;
    BYTE    MinorLinkerVersion;
    DWORD   SizeOfCode;
    DWORD   SizeOfInitializedData;
    DWORD   SizeOfUninitializedData;
    DWORD   AddressOfEntryPoint;
    DWORD   BaseOfCode;
    DWORD   BaseOfData;

    //
    // NT additional fields.
    //

    DWORD   ImageBase;
    DWORD   SectionAlignment;
    DWORD   FileAlignment;
    WORD    MajorOperatingSystemVersion;
    WORD    MinorOperatingSystemVersion;
    WORD    MajorImageVersion;
    WORD    MinorImageVersion;
    WORD    MajorSubsystemVersion;
    WORD    MinorSubsystemVersion;
    DWORD   Win32VersionValue;
    DWORD   SizeOfImage;
    DWORD   SizeOfHeaders;
    DWORD   CheckSum;
    WORD    Subsystem;
    WORD    DllCharacteristics;
    DWORD   SizeOfStackReserve;
    DWORD   SizeOfStackCommit;
    DWORD   SizeOfHeapReserve;
    DWORD   SizeOfHeapCommit;
    DWORD   LoaderFlags;
    DWORD   NumberOfRvaAndSizes;
    IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
} IMAGE_OPTIONAL_HEADER32, *PIMAGE_OPTIONAL_HEADER32;
```

- 64 bits

```c
typedef struct _IMAGE_OPTIONAL_HEADER64 {
    WORD        Magic;
    BYTE        MajorLinkerVersion;
    BYTE        MinorLinkerVersion;
    DWORD       SizeOfCode;
    DWORD       SizeOfInitializedData;
    DWORD       SizeOfUninitializedData;
    DWORD       AddressOfEntryPoint;
    DWORD       BaseOfCode;
    ULONGLONG   ImageBase;
    DWORD       SectionAlignment;
    DWORD       FileAlignment;
    WORD        MajorOperatingSystemVersion;
    WORD        MinorOperatingSystemVersion;
    WORD        MajorImageVersion;
    WORD        MinorImageVersion;
    WORD        MajorSubsystemVersion;
    WORD        MinorSubsystemVersion;
    DWORD       Win32VersionValue;
    DWORD       SizeOfImage;
    DWORD       SizeOfHeaders;
    DWORD       CheckSum;
    WORD        Subsystem;
    WORD        DllCharacteristics;
    ULONGLONG   SizeOfStackReserve;
    ULONGLONG   SizeOfStackCommit;
    ULONGLONG   SizeOfHeapReserve;
    ULONGLONG   SizeOfHeapCommit;
    DWORD       LoaderFlags;
    DWORD       NumberOfRvaAndSizes;
    IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
} IMAGE_OPTIONAL_HEADER64, *PIMAGE_OPTIONAL_HEADER64;
```

- **Magic \[2-bytes/WORD\]**: is a field that identifies the state of the image. The [Microsoft documentation on Optional Header standard fields](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-standard-fields-image-only) mentions three common values:
    - **0x10B**: Identifies the image as a PE32 executable.
    - **0x20B**: Identifies the image as a PE32+ executable (aka. 64 bits)
    - **0x107**: Identifies the image as ROM.

The value of this field is what determines whether the executable is 32 or 64 bits, the "Machine" member of the "IMAGE\_FILE\_HEADER" structure is ignored by the Windows PE loader, instead, this one is used.

- **MajorLinkerVersion and MinorLinkerVersion \[1-byte/BYTE\]**: Indicate the major and minor version number of the linker used to create the executable file.
- **SizeOfCode \[4-bytes/DWORD\]**: Stores the total size, in bytes, of all sections containing executable code (normally the .text section).
- **SizeOfInitializedData \[4-bytes/DWORD\]**: Indicates the total size, in bytes, of all sections containing initialized data (normally the .data section).
- **SizeOfUninitializedData \[4-bytes/DWORD\]**: Stores the total size, in bytes, of all sections containing uninitialized data (normally the .bss section).
- **AddressOfEntryPoint \[4-bytes/DWORD\]**: It is an RVA (_Relative Virtual Address_) that points to the entry point of the image when loaded into memory. In executable applications, this value points to the start of the main function (for example, main or WinMain). In device drivers, it points to the initialization function. For DLLs, the entry point is optional, if it does not exist, this field is set to 0.
- **BaseOfCode \[4-bytes/DWORD\]**: It is an RVA that indicates the starting address of the code section (normally .text) in memory once the file is loaded.
- **BaseOfData \[4-bytes/DWORD\]**: It is an RVA that points to the start of the data section (normally .data) in memory after loading the file. This field does not exist in the PE32+ format.
- **ImageBase \[4-bytes/DWORD in PE32 and 8-bytes/ULONGLONG in PE32+\]**: Contains the preferred base address for loading the first byte of the image into memory. This value must be a multiple of 64 KB. However, due to protection mechanisms such as ASLR (_Address Space Layout Randomization_) and other reasons, the image is often not loaded at this address. In that case, the PE loader chooses an unused memory area to load the image and then performs a process called relocation. During relocation, the internal addresses of the image are adjusted so that they work with the new load base. There is a special section, called relocation section (.reloc), that contains information about the places that need to be adjusted if relocation is required.
- **SectionAlignment \[4-bytes/DWORD\]**: Specifies the alignment, in bytes, of the sections when they are loaded into memory. Sections are aligned at boundaries that are multiples of this value. By default, it is usually the page size of the architecture (for example, 4 KB) and cannot be less than the FileAlignment value.
- **FileAlignment \[4-bytes/DWORD\]**: Specifies the alignment, in bytes, of section data in the file (on disk). If the actual size of a section's data is less than FileAlignment, the rest is padded with zeros to meet the alignment. This value must be a power of 2 between 512 and 64 KB. If SectionAlignment is less than the architecture's page size, then FileAlignment and SectionAlignment must be equal.
- **MajorOperatingSystemVersion, MinorOperatingSystemVersion \[2-bytes/WORD\]**: Specify the major and minor version of the operating system required to run the file.
- **MajorImageVersion and MinorImageVersion \[2-bytes/WORD\]**: Indicate the major and minor version of the file image. These versions can be used by tools or systems to determine compatibility.
- **MajorSubsystemVersion and MinorSubsystemVersion \[2-bytes/WORD\]**: Specify the major and minor version of the required subsystem. By subsystem it refers to the execution environment, which can be a Windows graphical application (GUI), a console application (CUI), an EFI environment (Extensible Firmware Interface), or even a native application that interacts directly with the operating system kernel, among others.
- **Win32VersionValue \[4-bytes/DWORD\]**: Reserved field that, according to official documentation, must be set to 0.
- **SizeOfImage \[4-bytes/DWORD\]**: Indicates the total size of the image in memory (in bytes), including all headers and sections. It is rounded to the nearest multiple of "SectionAlignment", as this value is used when loading the image into memory.
- **SizeOfHeaders \[4-bytes/DWORD\]**: Is the combined size, in bytes, of the "DOS stub", PE headers (NT headers) and section headers, rounded to the nearest multiple of "FileAlignment".
- **CheckSum \[4-bytes/DWORD\]**: Field used to store the _checksum_ of the image, allowing verification of the file's integrity. The _checksum_ is a value calculated from the file content that acts as a fingerprint. If any byte of the file changes (for example, due to corruption or manipulation), the resulting _checksum_ will also change, which allows detecting inconsistencies or damage to the file. If this field is set to 0, the _checksum_ is not calculated or verified.
- **Subsystem \[2-bytes/WORD\]**: Specifies the subsystem required to run this file. Indicates the type of interface the program uses, such as whether it is a console application, a Windows GUI application, a driver, etc. The complete list of possible values is found in the [Microsoft documentation on Windows subsystems](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#windows-subsystem).
- **DLLCharacteristics \[2-bytes/WORD\]**: Defines various characteristics of the image file, such as support for NX (_No eXecute_) or whether the image can be relocated at runtime. Although it is called "DLLCharacteristics" for historical reasons, it also applies to normal executable files (EXE). The complete list of available _flags_ can be consulted in the [Microsoft documentation on DLL characteristics](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#dll-characteristics).
- **SizeOfStackReserve \[8-bytes/ULONGLONG\]**: Specifies the total amount of memory that is reserved for the main thread's stack.
- **SizeOfStackCommit \[8-bytes/ULONGLONG\]**: Indicates the initial amount of stack memory that is committed.
- **SizeOfHeapReserve \[8-bytes/ULONGLONG\]**: Specifies the total amount of memory that is reserved for the process's local heap.
- **SizeOfHeapCommit \[8-bytes/ULONGLONG\]**: Indicates the initial amount of heap memory that is committed.

**Note**: The "_reserve_" values indicate how much virtual memory is reserved, while the "_commit_" values indicate how much physical memory is initially allocated. Reserved memory can be committed later as needed.

- **LoaderFlags \[4-bytes/DWORD\]**: Reserved field that must be set to 0 according to the [Microsoft documentation on Windows-specific fields](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#optional-header-windows-specific-fields-image-only).
- **NumberOfRvaAndSizes \[4-bytes/DWORD\]**: Indicates the number of entries in the "DataDirectory" array. Specifies how many "IMAGE\_DATA\_DIRECTORY" structures follow.
- **DataDirectory \[IMAGE\_DATA\_DIRECTORY/Structure\]**: Is an array of "IMAGE\_DATA\_DIRECTORY" structures, where each entry provides the address and size of a specific table or information, such as the import table, exports, resources, etc. The number of entries is defined by "NumberOfRvaAndSizes".
    - Now we will talk in more detail about this member.

The optional header in our PE looks like this:

![Optional Header showing Magic, Entry Point and alignments](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-24.avif)

In the image we can observe that the "Magic" field has a value of 0x20B, which means that the file is a PE32+ executable. This format allows the file to use the full capacity of the 64-bit virtual address space.

The RVA (_Relative Virtual Address_) of the entry point is 0x14E0, which indicates the relative address where code execution will begin once loaded into memory. The code section starts at address 0x1000, and is aligned according to the "Section Alignment" value.

Additionally, the "File Alignment" field, with a value of 0x200, defines how sections are aligned in the file on disk, while in memory they follow the "Section Alignment" of 0x1000.

![.data section with zero padding for File Alignment](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-25.avif)

For example, the .data section has content from 0x2A00 to 0x2A70, and the rest of the section is padded with zeros to 0x2BFF, complying with the alignment defined by the "FileAlignment" field. This alignment ensures that sections on disk are organized in blocks of a predetermined size, while "SectionAlignment" defines how these sections are organized in memory once the file is loaded.

As for other important members, "SizeOfImage" has a value of 0x9000, which represents the total size of the image loaded in memory, and this value is a multiple of "SectionAlignment" (0x1000). "SizeOfHeaders", on the other hand, has a value of 0x400 and is aligned according to "FileAlignment", which ensures that the file headers occupy a complete block on disk, facilitating their correct reading by the operating system.

Finally, the "Subsystem" field has a value of 3, indicating that this file is a console application, which is consistent with the option I selected when creating the project in Visual Studio:

![Console subsystem selection in Visual Studio](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-26.avif)

##### Data Directories (IMAGE\_DATA\_DIRECTORY)

As we said before, the last member of the "IMAGE\_OPTIONAL\_HEADER" structure is an array of "IMAGE\_DATA\_DIRECTORY" structures.

```c
IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES];
```

"IMAGE\_NUMBEROF\_DIRECTORY\_ENTRIES" is a constant defined with the value 16, which means that the standard PE file can have up to 16 "IMAGE\_DATA\_DIRECTORY" entries.

```c
#define IMAGE_NUMBEROF_DIRECTORY_ENTRIES    16
```

The "IMAGE\_DATA\_DIRECTORY" structure is as follows:

```c
typedef struct _IMAGE_DATA_DIRECTORY {
    DWORD   VirtualAddress;
    DWORD   Size;
} IMAGE_DATA_DIRECTORY, *PIMAGE_DATA_DIRECTORY;
```

Compared to other PE file structures, "IMAGE\_DATA\_DIRECTORY" is quite simple, as it only has two members: "VirtualAddress", which contains the RVA that points to the start of the corresponding entry, and "Size", which defines the size of that entry.

So, the "Data Directories" member of "IMAGE\_OPTIONAL\_HEADER" is nothing more than a table containing the addresses and sizes to other important parts of the executable that are useful for the operating system loader. For example, an important directory is the "Import Directory", as it contains a list of external functions imported from other libraries.

Not all directories have the same structure, the "IMAGE\_DATA\_DIRECTORY.VirtualAddress" points to whatever directory, but the type of directory is what determines how the chunk of data will be interpreted.

In the _winnt.h_ library we can find a series of defined "Data Directories":

```c
// Directory Entries

#define IMAGE_DIRECTORY_ENTRY_EXPORT          0   // Export Directory
#define IMAGE_DIRECTORY_ENTRY_IMPORT          1   // Import Directory
#define IMAGE_DIRECTORY_ENTRY_RESOURCE        2   // Resource Directory
#define IMAGE_DIRECTORY_ENTRY_EXCEPTION       3   // Exception Directory
#define IMAGE_DIRECTORY_ENTRY_SECURITY        4   // Security Directory
#define IMAGE_DIRECTORY_ENTRY_BASERELOC       5   // Base Relocation Table
#define IMAGE_DIRECTORY_ENTRY_DEBUG           6   // Debug Directory
//      IMAGE_DIRECTORY_ENTRY_COPYRIGHT       7   // (X86 usage)
#define IMAGE_DIRECTORY_ENTRY_ARCHITECTURE    7   // Architecture Specific Data
#define IMAGE_DIRECTORY_ENTRY_GLOBALPTR       8   // RVA of GP
#define IMAGE_DIRECTORY_ENTRY_TLS             9   // TLS Directory
#define IMAGE_DIRECTORY_ENTRY_LOAD_CONFIG    10   // Load Configuration Directory
#define IMAGE_DIRECTORY_ENTRY_BOUND_IMPORT   11   // Bound Import Directory in headers
#define IMAGE_DIRECTORY_ENTRY_IAT            12   // Import Address Table
#define IMAGE_DIRECTORY_ENTRY_DELAY_IMPORT   13   // Delay Load Import Descriptors
#define IMAGE_DIRECTORY_ENTRY_COM_DESCRIPTOR 14   // COM Runtime descriptor
```

As we could observe before in the optional header, we can find the directory table with their respective values:

![Data Directories table with addresses and sizes](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-27.avif)

When an entry has both values ("Address" and "Size") at zero it means that that specific data directory is not used (does not exist). Next, before continuing we are going to briefly mention the export directory and the import address table, which are two important entries of the "Data Directories".

###### Export Directory

The export directory of an image file is a data structure that contains information about the functions and variables that are exported from the executable.

```c
typedef struct _IMAGE_EXPORT_DIRECTORY {
    ULONG   Characteristics;
    ULONG   TimeDateStamp;
    USHORT  MajorVersion;
    USHORT  MinorVersion;
    ULONG   Name;
    ULONG   Base;
    ULONG   NumberOfFunctions;
    ULONG   NumberOfNames;
    PULONG  *AddressOfFunctions;
    PULONG  *AddressOfNames;
    PUSHORT *AddressOfNameOrdinals;
} IMAGE_EXPORT_DIRECTORY, *PIMAGE_EXPORT_DIRECTORY;
```

It contains the addresses of the exported functions and variables, which can be used by other executable files to access those functions and data. The export directory is generally found in DLLs that export functions (for example, _kernel32.dll_ exporting _CreateFileA_).

###### Import Address Table (IAT)

The import address table is a data structure in an image file that contains information about the addresses of functions imported from other executable files. These addresses are used to access functions and data in other executables (for example, _Programita.exe_ importing _CreateFileA_ from _kernel32.dll_).

## Section Headers

After the optional header we can find the section headers. These headers contain information about the sections of the PE file. A section header is a structure called "IMAGE\_SECTION\_HEADER" defined in _winnt.h_:

```c
typedef struct _IMAGE_SECTION_HEADER {
    BYTE    Name[IMAGE_SIZEOF_SHORT_NAME];
    union {
            DWORD   PhysicalAddress;
            DWORD   VirtualSize;
    } Misc;
    DWORD   VirtualAddress;
    DWORD   SizeOfRawData;
    DWORD   PointerToRawData;
    DWORD   PointerToRelocations;
    DWORD   PointerToLinenumbers;
    WORD    NumberOfRelocations;
    WORD    NumberOfLinenumbers;
    DWORD   Characteristics;
} IMAGE_SECTION_HEADER, *PIMAGE_SECTION_HEADER;
```

- **Name \[1-byte/BYTE\]**: the first field of the section header is an array of the size of "IMAGE\_SIZEOF\_SHORT\_NAME":

```c
#define IMAGE_SIZEOF_SHORT_NAME 		8
```

Having a default value of 8, it means that the section name cannot be longer than 8 characters. For executables this value is maintained, for other types of files there are some options to be able to set longer names.

- **PhysicalAddress or VirtualSize \[4-bytes/DWORD\]**: This field is a union and can be called "PhysicalAddress" or "VirtualSize". In object files, it is called "PhysicalAddress" and contains the total size of the section. In executable images, it is called "VirtualSize" and contains the total size of the section when loaded into memory.
- **VirtualAddress \[4-bytes/DWORD\]**: Contains the relative virtual address (RVA) of the first byte of the section with respect to the image base when loaded into memory. For object files, contains the address of the first byte of the section before relocations are applied.
- **SizeOfRawData \[4-bytes/DWORD\]**: This field contains the size of the section on disk, it must be a multiple of "IMAGE\_OPTIONAL\_HEADER.FileAlignment".
- **PointerToRawData \[4-bytes/DWORD\]**: A pointer to the beginning of the section within the file, for executable images, it must be a multiple of "IMAGE\_OPTIONAL\_HEADER.FileAlignment".
- **PointerToRelocations \[4-bytes/DWORD\]**: A file pointer to the beginning of the section's relocation entries. Set to 0 for executable files.
- **PointerToLineNumbers \[4-bytes/DWORD\]**: A file pointer to the beginning of COFF line number entries for the section. Set to 0 because COFF debugging information is obsolete.
- **NumberOfRelocations \[2-bytes/WORD\]**: The number of relocation entries for the section, set to 0 for executable images.
- **NumberOfLinenumbers \[2-bytes/WORD\]**: The number of COFF line number entries for the section, set to 0 because COFF debugging information is obsolete.
- **Characteristics \[4-bytes/DWORD\]**: Contains _flags_ that describe the characteristics of the section. These _flags_ indicate whether the section contains executable code, initialized or uninitialized data, whether it can be shared in memory, among others. A complete list of these _flags_ can be found in the [Microsoft documentation on section flags](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#section-flags).

Of all these mentioned members, an important detail is that the value of "SizeOfRawData" and "VirtualSize" can be different. What do I mean and why does this happen?

"SizeOfRawData" must be a multiple of "IMAGE\_OPTIONAL\_HEADER.FileAlignment" (0x200 in hexadecimal, 512 in decimal). Therefore, if the actual size of the section on disk is less than "FileAlignment" or is not a multiple of this value, "SizeOfRawData" will be rounded to the next nearest multiple. For example, if the size of a section on disk is 600 bytes, it will be rounded to the next multiple of 512 (0x200), which is 1024 bytes (0x400).

On the other hand, "VirtualSize" represents the actual size of the section in memory. Unlike "SizeOfRawData", "VirtualSize" does not need to be a multiple of any alignment value. However, the virtual address where the section begins ("VirtualAddress") must be aligned according to "IMAGE\_OPTIONAL\_HEADER.SectionAlignment" (0x1000 in hexadecimal, 4096 in decimal).

Due to these differences, it can happen that the size of the section on disk is larger than the size of the section in memory. This happens because "SizeOfRawData" is aligned to the next multiple of "FileAlignment", which can introduce unused space in the file.

Conversely, it can also happen that "VirtualSize" is larger than "SizeOfRawData". This occurs if the section contains uninitialized data, such as global or static variables with no assigned value, commonly located in the .bss section. This uninitialized data does not take up space on disk because there is no real information to store, "SizeOfRawData" does not include its size. However, when the executable is loaded into memory, the operating system reserves space for this data, generally initializing it to zero. In this way, the section expands in memory to include the necessary space for the uninitialized data, and "VirtualSize" reflects this larger size.

In summary, "SizeOfRawData" can be larger than "VirtualSize" due to on-disk alignment that adds unused space. On the other hand, "VirtualSize" can be larger than "SizeOfRawData" when the section includes uninitialized data that requires space in memory but does not occupy space on disk.

Well with all this, the section headers of our executable in PE-Bear look like this:

![Section headers showing addresses and sizes](https://cdn.deephacking.tech/i/posts/anatomia-del-formato-portable-executable/anatomia-del-formato-portable-executable-28.avif)

In the image we can observe the following columns (among others):

- "Raw. Addr." --> "IMAGE\_SECTION\_HEADER.PointerToRawData"

- "Raw Size" --> "IMAGE\_SECTION\_HEADER.SizeOfRawData"

- "Virtual Addr." --> "IMAGE\_SECTION\_HEADER.VirtualAddress"

- "Virtual Size" --> "IMAGE\_SECTION\_HEADER.VirtualSize"

Each pair of fields (_Raw_ and _Virtual_) are used to calculate where a section ends, both on disk and in memory, which is exactly what we have been talking about before.

For example, the .text section on disk has an address 0x400 and a size of 0x1200. Adding both, we get 0x1600, which marks the final limit of the .text section and the start of the next. This value indicates the first byte immediately after the .text section in the file on disk.

In memory, we can do a similar calculation. The .text section has a virtual address ("VirtualAddress") of 0x1000 and a virtual size ("VirtualSize") of 0x10C9. Although the actual size of the section is 4297 bytes (0x10C9 in hexadecimal), sections must start at addresses that are multiples of "IMAGE\_OPTIONAL\_HEADER.SectionAlignment" (0x1000 in hexadecimal, 4096 in decimal). This means that the .text section starts at 0x1000.

Because the "VirtualSize" of the .text section (4297 bytes) exceeds the size of "SectionAlignment" (4096 bytes), the section occupies more than one alignment interval. By adding the initial virtual address and the virtual size (0x1000 + 0x10C9), we get 0x20C9, which is where the .text section ends in memory. However, sections must start at addresses that are multiples of "SectionAlignment", so the next section starts at the next aligned address after 0x20C9. The next multiple of 0x1000 after 0x20C9 is 0x3000.

Therefore, although the "VirtualSize" of the .text section is not a multiple of "SectionAlignment", the operating system reserves space in memory from 0x1000 to 0x3000 for the .text section, extending its final limit to 0x3000, which is the beginning of the next section in memory, the .rdata section. So there is unused space between the actual end of the .text section data and the start of the next section.

To finish, the "Characteristics" field indicates that some sections are read-only, others allow reading and writing, and some are executable. On the other hand, the "Ptr to Reloc.", "Num. of Reloc." and "Num. of Linenum." fields are at zero, which is normal for an image file.

## Conclusion

Well, up to this point we have seen practically the most fundamental aspects of the Portable Executable (PE) format, it's not everything because there are still things to see but without a doubt now you know the fundamentals. Knowing how this type of file is structured is truly important if you want to learn both malware development and analysis.

## References

- [MalDev Academy - 10% discount with code DEEPHACKING10](https://maldevacademy.com/)
- [Windows PE File Structure - Malcore](https://bible.malcore.io/readme/the-journey/windows-pe-structure)
- [A dive into the PE file format - Introduction - 0xRick](https://0xrick.github.io/win-internals/pe1/)
- [A dive into the PE file format - PE file structure - Part 1: Overview - 0xRick](https://0xrick.github.io/win-internals/pe2/)
- [A dive into the PE file format - PE file structure - Part 2: DOS Header, DOS Stub and Rich Header - 0xRick](https://0xrick.github.io/win-internals/pe3/)
- [A dive into the PE file format - PE file structure - Part 3: NT Headers - 0xRick](https://0xrick.github.io/win-internals/pe4/)
- [A dive into the PE file format - PE file structure - Part 4: Data Directories, Section Headers and Sections - 0xRick](https://0xrick.github.io/win-internals/pe5/)
- [An Introduction to Malware Analysis - PE format - crow](https://youtu.be/-cIxKeJp4xo?si=76LAoadT1qQ8GEuI&t=1110)
- [Portable Executable File Format - kowalczyk](https://blog.kowalczyk.info/articles/pefileformat.html)
- [Portable Executable Format: Made Easy - v0rkath](https://www.v0rkath.com/blog/portable-executable-format/)
- [File formats dissections and more... - corkami](https://github.com/corkami/pics/)
- [Why is 0x00400000 the default base address for an executable?](https://devblogs.microsoft.com/oldnewthing/20141003-00/?p=43923)
- [VA (Virtual Address) & RVA (Relative Virtual Address)](https://stackoverflow.com/questions/2170843/va-virtual-address-rva-relative-virtual-address)
- [/BASE (Base address)](https://learn.microsoft.com/en-us/cpp/build/reference/base-base-address?view=msvc-170)
- [winnt.h - mingw-w64](https://github.com/Alexpux/mingw-w64/blob/master/mingw-w64-tools/widl/include/winnt.h)
- [Windows Portable Executable (PE) Files Structure - filovirid.com](https://blog.filovirid.com/page/Windows-Portable-Executable-Files-Structure)
- [Difference Between Linker and Loader - GeeksForGeeks](https://www.geeksforgeeks.org/difference-between-linker-and-loader/)
- [Compilation process with GCC and C programs - luischaparroc](https://medium.com/@luischaparroc/compilation-process-with-gcc-and-c-programs-344445180ac8)
