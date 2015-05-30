#include "learnuv.h"

#define BUF_SIZE 37
static const char *filename = __MAGIC_FILE__;

static uv_fs_t open_req;

void read_cb(uv_fs_t* read_req) {
  int r = 0;
  if (read_req->result < 0) CHECK(read_req->result, "uv_fs_read callback");

  log_report("%s", read_req->bufs->base);
  log_info("%s", read_req->bufs->base);

  uv_fs_t close_req;
  r = uv_fs_close(read_req->loop, &close_req, open_req.result, NULL);
  if (r < 0) CHECK(r, "uv_fs_close");

  uv_fs_req_cleanup(&open_req);
  uv_fs_req_cleanup(read_req);
  uv_fs_req_cleanup(&close_req);
}

int main() {
  int r = 0;
  uv_loop_t *loop = uv_default_loop();

  r = uv_fs_open(loop, &open_req, filename, O_RDONLY, S_IRUSR, NULL);
  if (r < 0) CHECK(r, "uv_fs_open");

  char buf[BUF_SIZE + 1];
  memset(buf, 0, sizeof(buf));
  uv_buf_t iov = uv_buf_init(buf, BUF_SIZE);

  uv_fs_t read_req;
  r = uv_fs_read(loop, &read_req, open_req.result, &iov, 1, 0, read_cb);
  if (r < 0) CHECK(r, "uv_fs_read");

  uv_run(loop, UV_RUN_DEFAULT);

  return 0;
}
