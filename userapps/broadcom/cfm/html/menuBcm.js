
function createDeviceInfoMenu(options) {
   var proto = options[0];
   var ipExt = options[1];
   var dhcpen = options[2];
   var user = options[3];

	 foldersTree = gFld('', '');
   // device summary menu
   if(user == 'support')
      insFld(foldersTree, gFld(getMenuTitle(MENU_DEVICE_SUMMARY), 'info_support.html'));
   else if(user == 'user')
      insFld(foldersTree, gFld(getMenuTitle(MENU_DEVICE_SUMMARY), 'info_user.html'));
   else
      insFld(foldersTree, gFld(getMenuTitle(MENU_DEVICE_SUMMARY), 'info.html'));
   // device wan menu
   insFld(foldersTree, gFld(getMenuTitle(MENU_DEVICE_WAN), 'wancfg.cmd?action=view'));
   // device statistics menu
   nodeSts = insFld(foldersTree, gFld(getMenuTitle(MENU_STATISTICS), 'statsifc.html'));
   insDoc(nodeSts, gLnk('R', getMenuTitle(MENU_ST_LAN), 'statsifc.html'));
   insDoc(nodeSts, gLnk('R', getMenuTitle(MENU_WAN), 'statswan.cmd'));
   insDoc(nodeSts, gLnk('R', getMenuTitle(MENU_ST_ATM), 'statsatm.cmd'));
   insDoc(nodeSts, gLnk('R', getMenuTitle(MENU_ST_ADSL), 'statsadsl.html'));
   // device route menu
   insFld(foldersTree, gFld(getMenuTitle(MENU_DEVICE_ROUTE), 'rtroutecfg.cmd?action=view'));
   insFld(foldersTree, gFld(getMenuTitle(MENU_RT_ARP),'arpview.cmd'));
   // dhcp info
   if (!(proto == 'Bridge' || ipExt == '1') && dhcpen == '1') {
      insFld(foldersTree, gFld(getMenuTitle(MENU_DHCPINFO),'dhcpinfo.html'));
   }
	
}
function createAdvSetupMenu(options) {
	
   var user = options[0];
   var std = options[1];
   var proto = options[2];
   var firewall = options[3];
   var nat = options[4];
   var ipExt = options[5];
   var ddnsd = options[6];
   var ebtables = options[7];
   var bridge = options[8];
   var tod = options[9];
   var siproxd = options[10];
   var QosEnabled = options[11];
   var vlanconfig = options[12];
   var ipp = options[13];
   
   
   foldersTree = gFld('', '');
	 // Configure quick setup wizard
   //if ( proto == 'Not Applicable' )
     //insFld(foldersTree, gLnk('R', getMenuTitle(MENU_QUICK_SETUP), 'vpivci.cgi'));

   insFld(foldersTree, gLnk('R', getMenuTitle(MENU_WAN),'wancfg.cmd'));
   insFld(foldersTree, gLnk('R', getMenuTitle(MENU_LAN),'lancfg2.html'));

   // Configure security menu
   // If firewall is enabled and not in ipExt mode enable firewall menus
   // if (proto != 'Bridge' && ipExt != '1' ) {
   if ( proto != 'Not Applicable' && ipExt != '1' ) {
      // If NAT is On enable virtual server menus
      if ( nat == '1' ) {
         nodeNat = insFld(foldersTree, gFld(getMenuTitle(MENU_SC_NAT), 'scvrtsrv.cmd?action=view'));
         insDoc(nodeNat, gLnk('R', getMenuTitle(MENU_SC_VIRTUAL_SERVER), 'scvrtsrv.cmd?action=view'));
         insDoc(nodeNat, gLnk('R', getMenuTitle(MENU_SC_PORT_TRIGGER), 'scprttrg.cmd?action=view'));
         insDoc(nodeNat, gLnk('R', getMenuTitle(MENU_SC_DMZ_HOST), 'scdmz.html'));
         if ( siproxd == '1' )
            insDoc(nodeNat, gLnk('R', getMenuTitle(MENU_SIPROXD), 'siproxdcfg.html'));
      }
      if ( proto != 'Bridge' && firewall == '1' ) {
         nodeFirewall = insFld(foldersTree, gFld(getMenuTitle(MENU_SC_SECURITY), 'scoutflt.cmd?action=view'));
         nodeIpFlt = insFld(nodeFirewall, gFld(getMenuTitle(MENU_SC_IP_FILTER), 'scoutflt.cmd?action=view'));
         insDoc(nodeIpFlt, gLnk('R', getMenuTitle(MENU_SC_OUTGOING), 'scoutflt.cmd?action=view'));
         insDoc(nodeIpFlt, gLnk('R', getMenuTitle(MENU_SC_INCOMING), 'scinflt.cmd?action=view'));
      } else {
         if ( ebtables == '1' ) {
            if ( bridge == '1' )
               nodeFirewall = insFld(foldersTree, gFld(getMenuTitle(MENU_SC_SECURITY),'scmacflt.cmd?action=view'));
            //else if ( tod == '1' )
               //nodeFirewall = insFld(foldersTree, gFld(getMenuTitle(MENU_TOD),'todmngr.tod?action=view'));
         }
      }
      // Configure MAC filtering menu
      if ( ebtables == '1' ) {
         if ( bridge == '1' )
            insFld(nodeFirewall, gFld(getMenuTitle(MENU_MAC_FILTER),'scmacflt.cmd?action=view'));
         //if ( tod == '1' )
            //insFld(nodeFirewall, gFld(getMenuTitle(MENU_TOD),'todmngr.tod?action=view'));
      }
   }
  //if(user=='root'||user=='support')
  if(user=='root')
  {
   
   if (QosEnabled=='true')
      // Configure QoS class menu
      insFld(foldersTree, gFld(getMenuTitle(MENU_QOS_CLASS),'qoscls.cmd?action=view'));
  }
      // Configure routing menu
    nodeRouting = insFld(foldersTree, gFld(getMenuTitle(MENU_ROUTING), 'rtdefaultcfg.html'));
    insDoc(nodeRouting, gLnk('R', getMenuTitle(MENU_RT_DEFAULT_ROUTE), 'rtdefaultcfg.html'));
    insDoc(nodeRouting, gLnk('R', getMenuTitle(MENU_RT_STATIC_ROUTE),'rtroutecfg.cmd?action=viewcfg'));
  
     if ( (proto == 'PPPoE' && ipExt == '0') ||
        (proto == 'PPPoA' && ipExt == '0') ||
        (proto == 'MER') ||
        (proto == 'IPoA') ) {
      // configure rip
      // insDoc(nodeRouting, gLnk('R', getMenuTitle(MENU_RT_RIP),'ripcfg.cmd?action=view'));
   
        // configure dns server
        if ( ddnsd == '1' ) 
        {
           insFld(foldersTree, gFld(getMenuTitle(MENU_DNS), 'ddnsmngr.cmd'));
           //nodeDnsSetup = insFld(foldersTree, gFld(getMenuTitle(MENU_DNS), 'ddnsmngr.cmd'));
           // insDoc(nodeDnsSetup, gLnk('R', getMenuTitle(MENU_DNS_SETUP), 'dnscfg.html'));
          // configure ddns client
           //if ( ddnsd == '1' )
            //insDoc(nodeDnsSetup, gLnk('R', getMenuTitle(MENU_DDNS), 'ddnsmngr.cmd'));
         }
       }
  
  if(user=='root'||user=='support')
   {
     // Configure ADSL Setting Menu based on Annex
     if ( std == 'annex_c' )
       insFld(foldersTree, gFld(getMenuTitle(MENU_DSL), 'adslcfgc.html'));
     else
       insFld(foldersTree, gFld(getMenuTitle(MENU_DSL), 'adslcfg.html'));

     // Configure print server
     if ( ipp == '1' )
        insDoc(foldersTree, gFld(getMenuTitle(MENU_IPP), 'ippcfg.html'));
       // Configure VLAN port mapping menu
     if ( vlanconfig == '1' ) 
     {
      insDoc(foldersTree, gLnk('R', getMenuTitle(MENU_PORTMAP),'portmap.cmd'));
     }
  }
	
}

function createWirelessMenu(options) {
	   var user = options[0];
	   var wireless = options[1];
	   foldersTree = gFld('', '');
	   // Configure wireless menu
   if ( wireless == '1' ) 
   {
      insFld(foldersTree, gLnk('R', getMenuTitle(MENU_WL_BASIC), 'wlcfg.html'));
      insFld(foldersTree, gLnk('R', getMenuTitle(MENU_WL_SECURITY), 'wlsecurity.html'));
      insFld(foldersTree, gLnk('R', getMenuTitle(MENU_WL_MAC_FILTERING), 'wlmacflt.cmd?action=view'));
      if(user=='root'||user=='support')
         insFld(foldersTree, gLnk('R', getMenuTitle(MENU_WL_WDS), 'wlwds.cmd?action=view'));
      insFld(foldersTree, gLnk('R', getMenuTitle(MENU_WL_ADVANCED), 'wlcfgadv.html'));
      insFld(foldersTree, gLnk('R', getMenuTitle(MENU_WL_STATION_LIST), 'wlstationlist.cmd'));
   }
}
function createVoiceMenu(options) {
	   var user = options[0];
	   var voice = options[1];
	    // Configure voice menu
	   foldersTree = gFld('', '');
   if ( voice == 'mgcp' ) 
   {
      nodeVoice = insFld(foldersTree, gFld(getMenuTitle(MENU_VOICE_MGCP), 'voicemgcpview.cmd'));
      //insDoc(nodeVoice, gLnk('R', getMenuTitle(MENU_VOICE_STATS), 'voicestats45.html'));
   }
   else if ( voice == 'sip' ) 
   {
      nodeVoice = insFld(foldersTree, gFld(getMenuTitle(MENU_VOICE_SIP), 'voicesipview.cmd'));
   }  
 }
 
 function createDiagMenu() {
 	
 	 foldersTree = gFld('', '');
 	   // Configure diagnostics menu
   nodeDiagnostics = insFld(foldersTree, gFld(getMenuTitle(MENU_DIAGNOSTICS), 'diag.html'));
 	
}
 function createManageMenu(options) {
   var user = options[0];
 	 var sntp = options[1];
 	 var proto = options[2];
 	 var snmp = options[3];
 	 var ipExt = options[4];
 	
   foldersTree = gFld('', '');
 	   // Configure management menu
   nodeSettings = insFld(foldersTree, gFld(getMenuTitle(MENU_TL_SETTINGS), 'backupsettings.html'));
   insDoc(nodeSettings, gLnk('R', getMenuTitle(MENU_TL_SETTINGS_BACKUP),'backupsettings.html'));
   insDoc(nodeSettings, gLnk('R', getMenuTitle(MENU_TL_SETTINGS_UPDATE),'updatesettings.html'));
   insDoc(nodeSettings, gLnk('R', getMenuTitle(MENU_TL_SETTINGS_DEFAULT), 'defaultsettings.html'));

   //insFld(foldersTree, gFld(getMenuTitle(MENU_TL_SYSTEM_LOG), 'logintro.html'));
   //if(user=='root'||user=='support')
    if(user=='root')
   {
      insFld(foldersTree, gFld(getMenuTitle(MENU_TL_SYSTEM_LOG), 'logintro.html'));
    //if ( snmp == '1' )
      //insFld(foldersTree, gFld(getMenuTitle(MENU_TL_SNMP), 'snmpconfig.html'));
   
   if ( sntp == '1' && proto != 'Bridge' && !(proto=='PPPoE' && ipExt=='1') && !(proto=='PPPoA' && ipExt=='1') )
      insFld(foldersTree, gFld(getMenuTitle(MENU_SNTP), 'sntpcfg.html'));
    //nodeAccCntr = insFld(foldersTree, gFld(getMenuTitle(MENU_ACC_CNTR), 'scsrvcntr.cmd?action=view'));
    nodeAccCntr = insFld(foldersTree, gFld(getMenuTitle(MENU_ACC_CNTR), 'password.html'));
    //insDoc(nodeAccCntr, gLnk('R', getMenuTitle(MENU_ACC_CNTR_SERVICE), 'scsrvcntr.cmd?action=view'));
    //insDoc(nodeAccCntr, gLnk('R', getMenuTitle(MENU_ACC_CNTR_IP_ADDR), 'scacccntr.cmd?action=view'));
    insDoc(nodeAccCntr, gLnk('R', getMenuTitle(MENU_ACC_CNTR_PASSWORD), 'password.html'));
   }

   insFld(foldersTree, gFld(getMenuTitle(MENU_TL_UPDATE_SOFTWARE), 'upload.html'));
   insFld(foldersTree, gFld(getMenuTitle(MENU_RESET_ROUTER), 'resetrouter.html'));
 	
}

 
