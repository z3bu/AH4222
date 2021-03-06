#ifndef __TIMER_H__
#define __TIMER_H__
/****************************************************************************
*
*   Copyright (c) 2000, Sony Computer Entertainment of America Inc.
*   All rights reserved
*   SCEA Confidential
*
*    Document: TIMER.H
*      Author: Ben Wiggins
*        Date: 7/15/2002   
*      Header: Timer stuff
*
****************************************************************************/
/*============================================================================
=    INTERFACE REQUIRED HEADERS
============================================================================*/
/*============================================================================
=    INTERFACE DEFINITIONS / ENUMERATIONS / SIMPLE TYPEDEFS
============================================================================*/
/*============================================================================
=    INTERFACE STRUCTURES / UTILITY CLASSES
============================================================================*/
/*============================================================================
=    INTERFACE DATA DECLARATIONS
============================================================================*/
/*============================================================================
=    INTERFACE FUNCTION PROTOTYPES
============================================================================*/
void TIMER_Init(void);
void TIMER_Shutdown(void);
double TIMER_GetTime(void);

#include <time.h>
#ifdef CLOCKS_PER_SEC
#undef CLOCKS_PER_SEC
#endif
#define CLOCKS_PER_SEC 576000
extern clock_t TIMER_clock(void);

/*============================================================================
=    INTERFACE TRAILING HEADERS
============================================================================*/

/****************************************************************************
*
*    END HEADER TIMER.H
*
****************************************************************************/
#endif // __TIMER_H__

