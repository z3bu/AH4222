/*
 * Dropbear - a SSH2 server
 * 
 * Copyright (c) 2002,2003 Matt Johnston
 * All rights reserved.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE. */

/* Buffer handling routines, designed to avoid overflows/using invalid data */

#include "includes.h"
#include "util.h"
#include "buffer.h"

/* Create (malloc) a new buffer of size */
buffer* buf_new(unsigned int size) {

	buffer* ret;
	
	ret = (buffer*)m_malloc(sizeof(buffer));
	buf_init(ret, size);
	return ret;

}

/* free the buffer's data and the buffer itself */
void buf_free(buffer* buf) {

	m_free(buf->data)
	m_free(buf);
}

/* overwrite the contents of the buffer to clear it */
void buf_burn(buffer* buf) {
	
	m_burn(buf->data, buf->size);

}

/* initialise an already allocated buffer. The data won't be freed before
 * malloc */
void buf_init(buffer* buf, unsigned int size) {

	if (size > 0) {
		buf->data = (unsigned char*)m_malloc(size);
	} else {
		buf->data = NULL;
	}

	buf->size = size;
	buf->pos = 0;
	buf->len = 0;
}

/* resize a buffer, pos and len will be repositioned if required */
void buf_resize(buffer *buf, unsigned int newsize) {

	buf->data = m_realloc(buf->data, newsize);
	buf->size = newsize;
	buf->len = MIN(newsize, buf->len);
	buf->pos = MIN(newsize, buf->pos);

}

/* create a copy of buf, allocating required memory etc */
/* the new buffer is sized the same as the length of the source buffer */
/* lenonly is a boolean flag specifying whether to set the size of the new
 * buffer to be just the len of the source buffer (1), or the size of the
 * source buffer (0) */
buffer* buf_newcopy(buffer* buf) {
	
	buffer* ret;

	ret = buf_new(buf->len);
	ret->len = buf->len;
	memcpy(ret->data, buf->data, buf->len);
	return ret;
}

/* Set the length of the buffer */
void buf_setlen(buffer* buf, unsigned int len) {
	if (len > buf->size) {
		dropbear_exit("bad buf_setlen");
	}
	buf->len = len;
}

/* Increment the length of the buffer */
void buf_incrlen(buffer* buf, unsigned int incr) {
	if (buf->len + incr > buf->size) {
		dropbear_exit("bad buf_incrlen");
	}
	buf->len += incr;
}
/* Set the position of the buffer */
void buf_setpos(buffer* buf, unsigned int pos) {

	if (pos > buf->len) {
		dropbear_exit("bad buf_setpos");
	}
	buf->pos = pos;
}

/* increment the postion by incr, increasing the buffer length if required */
void buf_incrwritepos(buffer* buf, unsigned int incr) {
	if (buf->pos + incr > buf->size) {
		dropbear_exit("bad buf_incrwritepos");
	}
	buf->pos += incr;
	if (buf->pos > buf->len) {
		buf->len = buf->pos;
	}
}

/* increment the position by incr, negative values are allowed, to
 * decrement the pos*/
void buf_incrpos(buffer* buf,  int incr) {
	if ((unsigned int)((int)buf->pos + incr) > buf->len 
			|| ((int)buf->pos + incr) < 0) {
		dropbear_exit("bad buf_incrpos");
	}
	buf->pos += incr;
}

/* Get a byte from the buffer and increment the pos */
unsigned char buf_getbyte(buffer* buf) {

	if (buf->pos >= buf->len) {
		dropbear_exit("bad buf_getbyte");
	}
	return buf->data[buf->pos++];
}

/* put a byte, incrementing the length if required */
void buf_putbyte(buffer* buf, unsigned char val) {

	if (buf->pos >= buf->len) {
		buf_incrlen(buf, 1);
	}
	buf->data[buf->pos] = val;
	buf->pos++;
}

/* returns an in-place pointer to the buffer, for boundschecking */
unsigned char* buf_getptr(buffer* buf, unsigned int len) {

	if (buf->pos + len > buf->len) {
		dropbear_exit("bad buf_getptr");
	}
	return &buf->data[buf->pos];
}

/* like buf_getptr, but checks against total size, not used length.
 * This allows writing past the used length, but not past the size */
unsigned char* buf_getwriteptr(buffer* buf, unsigned int len) {

	if (buf->pos + len > buf->size) {
		dropbear_exit("bad buf_getwriteptr");
	}
	return &buf->data[buf->pos];
}

/* return a null-terminated string, it is malloced, so must be free()ed
 * Note that the string isn't checked for null bytes, hence the retlen
 * may be longer than what is returned by strlen */
unsigned char* buf_getstring(buffer* buf, unsigned int *retlen) {

	unsigned int len;
	unsigned char* ret;
	len = buf_getint(buf);
	if (len > MAX_STRING_LEN) {
		dropbear_exit("string too long");
	}

	if (retlen != NULL) {
		*retlen = len;
	}
	ret = m_malloc(len+1);
	memcpy(ret, buf_getptr(buf, len), len);
	buf_incrpos(buf, len);
	ret[len] = '\0';

	return ret;
}

/* Get an uint32 from the buffer and increment the pos */
unsigned int buf_getint(buffer* buf) {
	unsigned int ret;

	LOAD32H(ret, buf_getptr(buf, 4));
	buf_incrpos(buf, 4);
	return ret;
}

/* put a 32bit uint into the buffer, incr bufferlen & pos if required */
void buf_putint(buffer* buf, int unsigned val) {

	STORE32H(val, buf_getwriteptr(buf, 4));
	buf_incrwritepos(buf, 4);

}

/* put a SSH style string into the buffer, increasing buffer len if required */
void buf_putstring(buffer* buf, const unsigned char* str, unsigned int len) {
	
	buf_putint(buf, len);
	buf_putbytes(buf, str, len);

}

/* put the set of len bytes into the buffer, incrementing the pos, increasing
 * len if required */
void buf_putbytes(buffer *buf, const unsigned char *bytes, unsigned int len) {
	memcpy(buf_getwriteptr(buf, len), bytes, len);
	buf_incrwritepos(buf, len);
}
	

/* for our purposes we only need positive (or 0) numbers, so will
 * fail if we get negative numbers */
void buf_putmpint(buffer* buf, mp_int * mp) {

	unsigned int len, pad = 0;
	TRACE(("enter buf_putmpint"));

	assert(mp != NULL);

	if (SIGN(mp) == MP_NEG) {
		dropbear_exit("negative bignum");
	}

	/* zero check */
	if (USED(mp) == 1 && DIGIT(mp, 0) == 0) {
		len = 0;
	} else {
		/* SSH spec requires padding for mpints with the MSB set, this code
		 * implements it */
		len = mp_count_bits(mp);
		/* if the top bit of MSB is set, we need to pad */
		pad = (len%8 == 0) ? 1 : 0;
		len = len / 8 + 1; /* don't worry about rounding, we need it for
							  padding anyway when len%8 == 0 */

	}

	/* store the length */
	buf_putint(buf, len);
	
	/* store the actual value */
	if (len > 0) {
		if (pad) {
			buf_putbyte(buf, 0x00);
		}
		if (mp_to_unsigned_bin(mp, buf_getwriteptr(buf, len-pad)) != MP_OKAY) {
			dropbear_exit("mpint error");
		}
		buf_incrwritepos(buf, len-pad);
	}

	TRACE(("leave buf_putmpint"));
}

/* Retrieve an mp_int from the buffer.
 * Will fail for -ve since they shouldn't be required here.
 * Returns DROPBEAR_SUCCESS or DROPBEAR_FAILURE */
int buf_getmpint(buffer* buf, mp_int* mp) {

	unsigned int len;
	len = buf_getint(buf);
	
	if (len == 0) {
		mp_zero(mp);
		return DROPBEAR_SUCCESS;
	}

	/* check for negative */
	if (*buf_getptr(buf, 1) & (1 << (CHAR_BIT-1))) {
		return DROPBEAR_FAILURE;
	}

	if (mp_read_unsigned_bin(mp, buf_getptr(buf, len), len) != MP_OKAY) {
		return DROPBEAR_FAILURE;
	}

	buf_incrpos(buf, len);
	return DROPBEAR_SUCCESS;
}
