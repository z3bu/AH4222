/* LibTomMath, multiple-precision integer library -- Tom St Denis
 *
 * LibTomMath is library that provides for multiple-precision
 * integer arithmetic as well as number theoretic functionality.
 *
 * The library is designed directly after the MPI library by
 * Michael Fromberger but has been written from scratch with 
 * additional optimizations in place.
 *
 * The library is free for all purposes without any express
 * guarantee it works.
 *
 * Tom St Denis, tomstdenis@iahu.ca, http://math.libtomcrypt.org
 */
#include <tommath.h>

/* clear one (frees)  */
void
mp_clear (mp_int * a)
{
  if (a->dp != NULL) {

    /* first zero the digits */
    memset (a->dp, 0, sizeof (mp_digit) * a->used);

    /* free ram */
    free (a->dp);

    /* reset members to make debugging easier */
    a->dp = NULL;
    a->alloc = a->used = 0;
  }
}
