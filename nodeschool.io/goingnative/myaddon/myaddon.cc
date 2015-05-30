#include <nan.h>

#ifndef _WIN32
#include <unistd.h>
#endif

using namespace v8;

class MyWorker : public NanAsyncWorker {
 public:
  MyWorker(NanCallback *callback, int delay):
    NanAsyncWorker(callback),
    delay(delay)
  {}

  ~MyWorker() {}

  void Execute () {
    #ifdef _WIN32
      Sleep(delay);
    #else
      usleep(delay * 1000);
    #endif
  }

  void HandleOKCallback() {
    NanScope();
    callback->Call(0, NULL);
  }

 private:
  int delay;
};

NAN_METHOD(Delay) {
  NanScope();

  int msecs = args[0].As<Number>()->IntegerValue();

  NanCallback* callback = new NanCallback(args[1].As<Function>());
  MyWorker* worker = new MyWorker(callback, msecs);

  NanAsyncQueueWorker(worker);
  NanReturnUndefined();
}

void Init(Handle<Object> exports) {
  exports->Set(NanNew("delay"), NanNew<FunctionTemplate>(Delay)->GetFunction());
}

NODE_MODULE(myaddon, Init)
