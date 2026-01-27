---
title: "핸들러의 완벽한 전달 std::forward"
date: 2026-01-15
categories: [C++]
tags: [forward, handler, c++, cpp, move]
---

## std::forward

- `std::move`는 인자를 무조건 R-Value로 캐스팅하여 이동 생성/연산자를 사용할 수 있도록 하는 함수
- `std::forward`는 보편 참조 (Universal Reference) 매개변수를 받아서 호출자가 넘긴 value category(l-value, r-value)를 보존하여 다시 넘겨주는 함수
  - L-Value로 들어왔으면 L-Value로, R-Value로 들어왔으면 R-Value로 캐스팅 됨

### 기본 형태

```cpp
template <typename T, typename... Args>
void wrapper(T&& t, Args&&... args) {
    callee(std::forward<T>(t),
           std::forward<Args>(args)...);
}
```

- L-Value 인자가 들어오면 `T`는 `T&`로 추론되며 `std::forward<T>(t)`는 L-Value로 캐스팅 됨
- R-Value 인자가 들어오면 `T`는 그대로 `T`로 추론되며 `std::forward<T>(t)`는 R-Value로 캐스팅 됨

## 대표적인 예시

- 래퍼/팩토리/헬퍼 함수에서 인자를 있는 그대로 다른 함수/생성자에게 넘길 때
  ```cpp
  template <typename T, typename... Args>
  std::unique_ptr<T> make_ptr(Args&&... args) {
      return std::unique_ptr<T>(
          new T(std::forward<Args>(args)...)
      );
  }
  ```
- 컨테이너의 `emplace`
  ```cpp
  template <typename... Args>
  void emplace_back(Args&&... args) {
      new (&storage[size]) T(std::forward<Args>(args)...);
      ++size;
  }
  // forward를 통해 l-value 인자는 복사, r-value 인자는 이동이 됨
  ```

## 핸들러의 완벽한 전달

```cpp
// ContextManager.h
class ContextManager
{
// ...
public:
	template <typename CompletionHandler>
	auto RegisterWork(CompletionHandler handler)
	{
		asio::post(_io, std::forward<CompletionHandler>(handler));
	}
// ...
};
```

- Asio 라이브러리를 사용하면서 `io_context`에 대한 래퍼 클래스를 통해 `post`함수를 `RegisterWork`로 제공하면서 기존의 `asio.post`를 사용하는 것과 동일하게 핸들러를 전달하도록 하기위해 `std::forward`를 사용하여 호출 당시 핸들러 함수를 그대로 `asio.post`에 전달하도록 함

## 주의점

- 보편 참조(Universal Reference)가 아닌 평범한 인자에는 `std::forward`를 사용하지 않음
  - 템플릿 인자에만 사용하는것이 원칙
- `std::forward<T>(val)`에서 `T`는 반드시 함수 템플릿 형식의 인자여야 하며, 호출 시 그대로 전달해야 함
