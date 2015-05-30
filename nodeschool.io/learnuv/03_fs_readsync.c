#include "learnuv.h"

#define BUF_SIZE 37
static const char *filename = __MAGIC_FILE__;

int main() {
  int r = 0;
  int o = 0;
  uv_loop_t *loop = uv_default_loop();

  uv_fs_t open_req;
  o = uv_fs_open(loop, &open_req, filename, O_RDONLY, S_IRUSR, NULL);
  if (r < 0) CHECK(r, "uv_fs_open");

  char buf[BUF_SIZE + 1];
  memset(buf, 0, sizeof(buf));
  uv_buf_t iov = uv_buf_init(buf, BUF_SIZE);

  uv_fs_t read_req;
  r = uv_fs_read(loop, &read_req, o, &iov, 1, 0, NULL);
  if (r < 0) CHECK(r, "uv_fs_read");

  log_report("%s", buf);
  log_info("%s", buf);

  uv_fs_t close_req;
  r = uv_fs_close(loop, &close_req, o, NULL);
  if (r < 0) CHECK(r, "uv_fs_close");

  uv_fs_req_cleanup(&open_req);
  uv_fs_req_cleanup(&read_req);
  uv_fs_req_cleanup(&close_req);

  uv_run(loop, UV_RUN_DEFAULT);

  return 0;
}
