#include "learnuv.h"
#include <math.h>

const static char* HOST = "0.0.0.0";
const static int   PORT = 7000;
const static int   NBUFS = 1;

static uv_tcp_t tcp_server;

typedef struct {
  uv_write_t req;
  uv_buf_t buf;
} write_req_t;

static void close_cb(uv_handle_t* client);
static void shutdown_cb(uv_shutdown_t*, int);

static void alloc_cb(uv_handle_t*, size_t, uv_buf_t*);
static void read_cb(uv_stream_t*, ssize_t, const uv_buf_t*);
static void write_cb(uv_write_t*, int);

static void close_cb(uv_handle_t* client) {
  free(client);
  log_info("Closed connection");
  log_report("Closed connection");
}

static void shutdown_cb(uv_shutdown_t* req, int status) {
  uv_close((uv_handle_t*) req->handle, close_cb);
  free(req);
}

static void onconnection(uv_stream_t *server, int status) {
  CHECK(status, "onconnection");

  int r = 0;
  uv_shutdown_t *shutdown_req;

  log_info("Accepting Connection");

  uv_tcp_t *client = malloc(sizeof(uv_tcp_t));
  r = uv_tcp_init(server->loop, client);
  CHECK(r, "uv_tcp_init");

  r = uv_accept(server, (uv_stream_t*) client);
  if (r) {
    log_error("trying to accept connection %d", r);

    shutdown_req = malloc(sizeof(uv_shutdown_t));
    r = uv_shutdown(shutdown_req, (uv_stream_t*) client, shutdown_cb);
    CHECK(r, "uv_shutdown");
  }

  r = uv_read_start((uv_stream_t*) client, alloc_cb, read_cb);
  CHECK(r, "uv_read_start");
}

static void alloc_cb(uv_handle_t *handle, size_t size, uv_buf_t *buf) {
  buf->base = malloc(size);
  buf->len = size;

  if (buf->base == NULL) {
    log_error("alloc_cb buffer didn't properly initialize");
  }
}

static void read_cb(uv_stream_t* client, ssize_t nread, const uv_buf_t* buf) {
  int r = 0;
  uv_shutdown_t *shutdown_req;

  if (nread < 0) {
    if (nread != UV_EOF) CHECK(nread, "read_cb");

    free(buf->base);

    shutdown_req = malloc(sizeof(uv_shutdown_t));
    r = uv_shutdown(shutdown_req, client, shutdown_cb);
    CHECK(r, "uv_shutdown");
    return;
  }

  if (nread == 0) {
    free(buf->base);
    return;
  }

  if (!strncmp("QUIT", buf->base, fmin(nread, 4))) {
    log_info("Closing the server");
    free(buf->base);

    uv_close((uv_handle_t*) &tcp_server, NULL);
    log_info("Closed server, exiting");
    exit(0);
  }

  write_req_t *write_req = malloc(sizeof(write_req_t));
  write_req->buf = uv_buf_init(buf->base, nread);

  r = uv_write(&write_req->req, client, &write_req->buf, NBUFS, write_cb);
  CHECK(r, "uv_write");
}

static void write_cb(uv_write_t *req, int status) {
  CHECK(status, "write_cb");
  log_info("Replied to client");

  write_req_t *write_req = (write_req_t*) req;

  free(write_req->buf.base);
  free(write_req);
}

int main() {
  int r = 0;
  uv_loop_t *loop = uv_default_loop();

  r = uv_tcp_init(loop, &tcp_server);
  CHECK(r, "uv_tcp_init");

  struct sockaddr_in addr;
  r = uv_ip4_addr(HOST, PORT, &addr);
  CHECK(r, "uv_ip4_addr");

  r = uv_tcp_bind(&tcp_server, (const struct sockaddr*) &addr, 0);
  CHECK(r, "uv_tcp_bind");

  r = uv_listen((uv_stream_t*) &tcp_server, SOMAXCONN, onconnection);
  CHECK(r, "uv_listen");
  log_info("Listening on %s:%d", HOST, PORT);

  uv_run(loop, UV_RUN_DEFAULT);
  MAKE_VALGRIND_HAPPY();

  return 0;
}
