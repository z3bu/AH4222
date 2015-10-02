all:
	cp cfm_$(PROFILE)_save cfm

dynamic: all install webuihtml rmwl_html rmvoice_html

clean:
	rm -f cfm


install:
	install -m 755 cfm $(INSTALL_DIR)/bin
	$(STRIP) $(INSTALL_DIR)/bin/cfm

webuihtml:
	mkdir -p $(INSTALL_DIR)/webs
ifneq ($(strip $(PLATFORM)),)
	cp -f html_$(PLATFORM)/*.html html_$(PLATFORM)/*.js html_$(PLATFORM)/*.gif html_$(PLATFORM)/*.css $(INSTALL_DIR)/webs
else
	cp -f html/*.html html/*.js html/*.gif html/*.css $(INSTALL_DIR)/webs
endif
	mkdir -p $(INSTALL_DIR)/webs/image
ifneq ($(strip $(PLATFORM)),)
	cp -a html_$(PLATFORM)/image/*.gif $(INSTALL_DIR)/webs/image
else
	cp -a html/image/*.gif $(INSTALL_DIR)/webs/image
endif
	mkdir -p  $(INSTALL_DIR)/webs/button
ifneq ($(strip $(PLATFORM)),)
	cp -a html_$(PLATFORM)/button/*.gif $(INSTALL_DIR)/webs/button
else
	cp -a html/button/*.gif $(INSTALL_DIR)/webs/button
endif
	mkdir -p  $(INSTALL_DIR)/webs/titres
ifneq ($(strip $(PLATFORM)),)
	cp -a html_$(PLATFORM)/titres/*.gif $(INSTALL_DIR)/webs/titres
else
	cp -a html/titres/*.gif $(INSTALL_DIR)/webs/titres
endif

	
rmwl_html:
ifneq ($(strip $(WIRELESS)),1)
	rm -f $(INSTALL_DIR)/webs/wl*.html
else
rmwl_html:
endif

rmvoice_html:
ifneq ($(strip $(VOXXXLOAD)),1)
	rm -f $(INSTALL_DIR)/webs/voice*.html
else
rmvoice_html:
endif

