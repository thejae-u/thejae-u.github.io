---
title: "Boost.asio async 사용 및 주의점"
date: 2024-12-06
categories: [C++]
tags: [C++, boost.asio, asio, async, dangling-pointer]
---

## Boost.Asio async_write

- Boost.Asio 라이브러리의 async_write를 사용하는 방법은 다음과 같음

  > `boost::asio::async_write(s, boost::asio::buffer(data, size), handler);`

- 각 Parameter는 `AsyncWirteStream`, `ConstBufferSequence`, `WriteHandler`로 되어있음
- 두 번째 Parameter에는 string과 같이 서버 혹은 클라이언트로 보낼 데이터가 들어가게 되며, 공식 Document에서는 Boost.Asio 라이브러리의 buffer를 사용하도록 권장함

## Example

```cpp
void write(std::string message)
{
auto self(shared_from_this());

    boost::asio::async_write(_socket, boost::asio::buffer(message),
    [self, message](boost::system::error_code ec, std::size_t)
    {
        if(ec)
        {
            std::cerr << "Error: " << ec.message() << "\n";
            return;
        }

        self->read(); // 다음 데이터 전송을 대기하기 위한 호출
    });

}
```

- 예시 코드에서는 Write를 호출하면서 매개변수로 shared_ptr<string>을 넘겨주게 되어있으며 async_write에 매개변수를 넘겨줄 때에는 message를 boost::asio::buffer를 통해 넘겨줌
- 또한 Handler는 Lambda를 통해서 매개변수를 넘겨주었음

## 주의할 점

- Async 함수 내의 로컬 변수를 handler에서 사용할 가능성이 있다면 메모리 해제를 방지해야 함
- **예제에서의 `message`에 대한 관리**

- 공식 문서에는 다음과 같이 설명되어 있음

> One or more buffers containing the data to be written. Although the buffers object may be copied as necessary, ownership of the underlying memory blocks is retained by the caller, which must guarantee that they remain valid until the handler is called.

> 기록할 데이터가 포함된 하나 이상의 버퍼. 버퍼 개체는 필요에 따라 복사할 수 있지만 기본 메모리 블록의 소유권은 호출자가 유지하므로 핸들러가 호출될 때까지 유효하게 유지되어야 합니다. (papago 번역)

- 쉽게 말하자면 예제에서의 message는 handler가 호출 될 때 까지 유효해야 한다는 것
- 이와 같이 공식 문서에서도 메모리 관리에 대해 주의해야 한다고 되어있음

## 해결 방안

- 스마트 포인터의 사용

```cpp
void write(std::shared_ptr<std::string> message)
{
    auto self(shared_from_this());
    boost::asio::async_write(_socket, boost::asio::buffer(*message),
        [self, message](boost::system::error_code ec, std::size_t)
        {
            if(ec)
            {
                std::cerr << "Error: " << ec.message() << "\n";
                return;
            }

       self->read();
    });
}
```

- message 자체를 shared_ptr 로 관리하며 참조 count를 통해 소멸 시점을 늦춤
- 공식 문서에서 권장하는 방식과 부합하며 비동기적인 처리를 할 수 있는 가장 편하고 안전한 방법이라고 생각하여 사용하게 됨

## 결론

- async_write() 와 같은 비동기 처리 로직이 있다면 스마트 포인터를 적극 활용하여 안전한 비동기 처리를 할 수 있도록 해야 함
