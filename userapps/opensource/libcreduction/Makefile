#
# Makefile to call either uclibc or glibc optimizer
# 
# Copyright (C) 2004 Broadcom Corporation
#

# Platform dependencies, use different utility to optimize glibc and uclibc
ifneq ($(strip $(BRCM_UCLIBC)),)
  PLATFORM := uclibc
else
  PLATFORM := glibc
endif

ifneq ($(strip $(BRCM_APP_PHONE)),)
LIBOPT := n
else
LIBOPT := y
endif

ifeq ($(PLATFORM),glibc)
  LIBC := libc.so.6
  LINKER := ld.so.1
else
  ifeq ($(PLATFORM),uclibc)
    LIBC := libc.so.0
    LINKER := ld-uClibc.so.0
  else
    LIBC := libc.so.6
    LINKER := ld-linux.so.2
  endif
endif

# $(LIBC) and $(LINKER) is copied directly from toolchain installation, if no optimization
# $(LIBC) and $(LINKER) is copied from $(PLATFORM) after optimization, if we need optimization
# mklibs.py can optimize all the libraries, not just libc
# mklibs.py automatically finds all the necessary libraries, so the extralibs.mak applies to
# glibc or no optimization, which we have to manually specify

ifneq ($(LIBOPT),y)

TARGETS := $(LIBDIR)/$(LIBC) $(LIBDIR)/$(LINKER)
# Additional libraries to install
include extralibs.mak

libopt:

else

# Optimize libraries from archives
# if glibc, $(LIBC) is generated in $(PLATFORM) directory by generate_library
# if uclic, $(LIBC) is generated in $(PLATFORM) directory by mklibs.py 

ifeq ($(PLATFORM),glibc)
  TARGETS := $(PLATFORM)/$(LIBC) $(PLATFORM)/$(LINKER)
else
  ifeq ($(PLATFORM),uclibc)
    TARGETS := $(PLATFORM)/lib* $(PLATFORM)/$(LINKER)
  endif
endif
BINARIES := `find $(INSTALL_DIR) -path $(INSTALL_DIR)/lib -prune -o -type f -print | file -f - | grep ELF | cut -d':' -f1`

libopt:
	@echo Optimizing C run-time library...
	@if [ "$(PLATFORM)" = "glibc" ]; then \
	    @cp -f $(LIBDIR)/$(LINKER) $(PLATFORM); \
	    $(SHELL) -e generate_library $(PLATFORM) $(BINARIES); \
	fi
	@if [ "$(PLATFORM)" = "uclibc" ]; then \
	    python ./mklibs.py -D -L $(LIBDIR) --target=$(CROSS_COMPILE) -d $(PLATFORM) $(BINARIES); \
	fi
	
# Additional libraries to install
ifeq ($(PLATFORM),glibc)
  include extralibs.mak
endif 	

endif

# run-time start-ups, not needed any more.
#ifeq ($(PLATFORM),glibc)
#  TARGETS += $(LIBDIR)/crt1.o
#else
#  ifeq ($(PLATFORM),uclibc)
#    TARGETS += $(LIBDIR)/crt0.o
#  endif
#endif

#TARGETS += $(LIBDIR)/crti.o
#TARGETS += $(LIBDIR)/crtn.o

all:

install: libopt
	install $(TARGETS) $(INSTALL_DIR)/lib

clean:
	@if [ "$(INSTALL_DIR)" != "" -a "$(INSTALL_DIR)" != "/" ]; then rm -f $(INSTALL_DIR)/lib/*; fi
	@if [ "$(PLATFORM)" = "glibc" ]; then rm -f $(PLATFORM)/$(LIBC) $(PLATFORM)/$(LINKER); fi
	@if [ "$(PLATFORM)" = "uclibc" ]; then rm -f $(PLATFORM)/*; fi	
