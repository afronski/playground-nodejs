#include <assert.h>
#include "learnuv.h"

void idle_cb(uv_idle_t* handle) {
  static int64_t count = -1;

  count++;

  if ((count % 10000) == 0) {
    log_report(".");
  }

  if (count >= 50000) {
    uv_idle_stop(handle);
  }
}

int main() {
  uv_idle_t idle_handle;

  int err;

  uv_loop_t* event_loop = uv_default_loop();
  assert(event_loop != NULL && "Allocation failed.");

  err = uv_idle_init(event_loop, &idle_handle);
  CHECK(err, "uv_idle_init");

  err = uv_idle_start(&idle_handle, idle_cb);
  CHECK(err, "uv_idle_start");

  err = uv_run(event_loop, UV_RUN_DEFAULT);
  CHECK(err, "uv_run");

  return 0;
}
