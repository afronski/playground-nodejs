#include <nan.h>
#include <cstring>
#include <iostream>

#ifndef _WIN32
#include <unistd.h>
#endif

using namespace v8;

NAN_METHOD(Print) {
  Local<String> str = args[0].As<String>();
  std::cout << *String::Utf8Value(str) << std::endl;
  NanReturnUndefined();
}

NAN_METHOD(Length) {
  NanScope();

  Local<String> str = args[0].As<String>();
  Local<Number> result = NanNew<Number>(std::strlen(*String::Utf8Value(str)));

  NanReturnValue(result);
}

NAN_METHOD(Delay) {
  NanScope();

  Local<Number> v8msecs = args[0].As<Number>();
  Local<Function> callback = args[1].As<Function>();

  int msecs = v8msecs->IntegerValue();

  #ifdef _WIN32
    Sleep(msecs);
  #else
    usleep(msecs * 1000);
  #endif

  NanMakeCallback(NanGetCurrentContext()->Global(), callback, 0, NULL);

  NanReturnUndefined();
}

void Init(Handle<Object> exports) {
  exports->Set(NanNew("print"), NanNew<FunctionTemplate>(Print)->GetFunction());
  exports->Set(NanNew("length"), NanNew<FunctionTemplate>(Length)->GetFunction());
  exports->Set(NanNew("delay"), NanNew<FunctionTemplate>(Delay)->GetFunction());
}

NODE_MODULE(myaddon, Init)
