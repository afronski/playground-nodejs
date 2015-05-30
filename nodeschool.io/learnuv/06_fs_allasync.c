#include "learnuv.h"

#define BUF_SIZE 37
static const char *filename = __MAGIC_FILE__;

/* forward declarations */
void open_cb(uv_fs_t*);
void read_cb(uv_fs_t*);
void close_cb(uv_fs_t*);

typedef struct context_struct {
  uv_fs_t *open_req;
  uv_fs_t *read_req;
} context_t;

void open_cb(uv_fs_t* open_req) {
  int r = 0;
  if (open_req->result < 0) CHECK(open_req->result, "uv_fs_open callback");

  context_t* context = open_req->data;

  size_t buf_len = BUF_SIZE * sizeof(char);
  char* buf = malloc(buf_len);
  uv_buf_t iov = uv_buf_init(buf, buf_len);

  uv_fs_t *read_req = malloc(sizeof(uv_fs_t));
  context->read_req = read_req;
  read_req->data = context;

  r = uv_fs_read(open_req->loop, read_req, open_req->result, &iov, 1, 0, read_cb);
  if (r < 0) CHECK(r, "uv_fs_read");
}

void read_cb(uv_fs_t* read_req) {
  int r = 0;;
  if (read_req->result < 0) CHECK(read_req->result, "uv_fs_read callback");

  context_t* context = read_req->data;

  log_report("%s", read_req->bufs->base);
  log_info("%s", read_req->bufs->base);

  free(read_req->bufs->base);

  uv_fs_t *close_req = malloc(sizeof(uv_fs_t));
  close_req->data = context;

  r = uv_fs_close(read_req->loop, close_req, context->open_req->result, close_cb);
  if (r < 0) CHECK(r, "uv_fs_close");
}

void close_cb(uv_fs_t* close_req) {
  if (close_req->result < 0) CHECK(close_req->result, "uv_fs_close callback");

  context_t* context = close_req->data;

  uv_fs_req_cleanup(context->open_req);
  uv_fs_req_cleanup(context->read_req);
  uv_fs_req_cleanup(close_req);

  free(context);
}

void init(uv_loop_t *loop) {
  int r;

  uv_fs_t *open_req = malloc(sizeof(uv_fs_t));

  context_t *context = malloc(sizeof(context_t));
  context->open_req  = open_req;
  open_req->data = context;

  r = uv_fs_open(loop, open_req, filename, O_RDONLY, S_IRUSR, open_cb);
  if (r < 0) CHECK(r, "uv_fs_open");
}

int main() {
  uv_loop_t *loop = uv_default_loop();

  init(loop);
  uv_run(loop, UV_RUN_DEFAULT);

  return 0;
}
