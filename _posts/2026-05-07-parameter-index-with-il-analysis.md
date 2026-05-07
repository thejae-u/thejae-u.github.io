---
title: "IL 분석을 통해 얻은 것"
date: 2026-05-07
categories: [Personal]
tags: [C#, CSharp, IL]
---

> C# 의 IL 을 분석 할 수 있는 능력을 위해 IL코드를 직접 분석하는 도중 발생한 사소한 이슈에 대해 제대로 알고 기억하기 위해 이 글을 작성함

## IL 분석

Perplexity AI 를 통해 IL 코드를 무작정 해석해 달라 하고, 각 명령어가 뭘 의미하는지 부터 알아보게 되었다

```cs
public static bool IsNullOrEmpty([NotNullWhen(false)] string? value)
{
	 return value == null || value.Length == 0;
}
```

```cs
.method public hidebysig static bool
  IsNullOrEmpty(
      string 'value'
    ) cil managed
{
  .custom instance void System.Runtime.CompilerServices.NullableContextAttribute::.ctor(unsigned int8)
    = (01 00 02 00 00 ) // .....
    // unsigned int8(2) // 0x02
  .param [1]
    .custom instance void System.Diagnostics.CodeAnalysis.NotNullWhenAttribute::.ctor(bool)
      = (01 00 00 00 00 ) // .....
      // bool(false)
  .maxstack 8
  // [505 13 - 505 55]
  IL_0000: ldarg.0      // 'value'
  IL_0001: brfalse.s    IL_000d
  IL_0003: ldarg.0      // 'value'
  IL_0004: callvirt     instance int32 System.String::get_Length()
  IL_0009: ldc.i4.0
  IL_000a: ceq
  IL_000c: ret
  IL_000d: ldc.i4.1
  IL_000e: ret
} // end of method String::IsNullOrEmpty
```

가장 먼저 본 것은 `String.IsNullOrEmpty()`의 IL 코드이다

그 중에서도 IL_0000 으로 시작하는 asm 같은 부분을 자세히 보게 되었다

```cs
// [505 13 - 505 55]
  IL_0000: ldarg.0      // 'value'
  IL_0001: brfalse.s    IL_000d
  IL_0003: ldarg.0      // 'value'
  IL_0004: callvirt     instance int32 System.String::get_Length()
  IL_0009: ldc.i4.0
  IL_000a: ceq
  IL_000c: ret
  IL_000d: ldc.i4.1
  IL_000e: ret
```

- `IL_0000: ldarg.0`
  - 매개변수를 스택에 저장함
  - 여기서는 `String.IsNullOrEmtpy(string value)` 중 `value`에 해당된다
- `IL_0001: brfalse.s    IL_000d`
  - 0/null 인 경우 `IL_000d`로 분기함
  - 여기서는 `value`가 false 인 경우 분기하도록 한다
- `IL0003: ldarg.0`, `IL0004: callvirt    instance int32 System.String::get_Length()`
  - 매개변수를 다시 스택에 저장, value에 대한 Length를 호출
- `IL_0009: ldc.i4.0`
  - 0을 스택에 저장
- `IL_000a: ceq`
  - 같은지 비교 -> 0 또는 1을 스택에 저장
  - 여기서는 value의 Length와 스택에 저장된 0을 비교한다
- `IL_000c: ret`
  - return
  - 비교 결과를 return한다
- `IL_000d: ldc.i4.1`
  - 1을 스택에 저장
  - `IL_0001`을 통해 분기 한 결과로 value가 null 일 경우 1을 반환하도록 하기 위한 명령어다
- `IL_000e: ret`
  - return
  - `IL_000d`를 통해 저장된 1을 return한다

## 인스턴스 메서드의 `ldarg` 인덱스

### ConnectAsync IL

- 다음은 아무 코드나 읽어보자 해서 `Socket.Tasks.cs`에 존재하는 `ConnectAsync`에 대한 IL 코드를 읽어보게 되었다

```cs
public ValueTask ConnectAsync(string host, int port, CancellationToken cancellationToken)
{
    ArgumentNullException.ThrowIfNull(host);

    EndPoint ep = IPAddress.TryParse(host, out IPAddress? parsedAddress) ? (EndPoint)
        new IPEndPoint(parsedAddress, port) :
        new DnsEndPoint(host, port);
    return ConnectAsync(ep, cancellationToken);
}
```

```cs
method public hidebysig instance valuetype [System.Runtime]System.Threading.Tasks.ValueTask
  ConnectAsync(
      string host,
      int32 port,
	  valuetype [System.Runtime]System.Threading.CancellationToken cancellationToken
  ) cil managed
{
  .maxstack 3
  .locals (
    [0] class [System.Net.Primitives]System.Net.EndPoint ep,
    [1] class [System.Net.Primitives]System.Net.IPAddress parsedAddress
  )
  // [214 13 - 214 53]
  IL_0000: ldarg.1      // host
  IL_0001: ldstr        "host"
  IL_0006: call         void [System.Runtime]System.ArgumentNullException::ThrowIfNull(object, string)

  // [216 13 - 218 45]
  IL_000b: ldarg.1      // host
  IL_000c: ldloca.s     parsedAddress
  IL_000e: call         bool [System.Net.Primitives]System.Net.IPAddress::TryParse(string, class [System.Net.Primitives]System.Net.IPAddress&)
  IL_0013: brtrue.s     IL_001e
  IL_0015: ldarg.1      // host
  IL_0016: ldarg.2      // port
  IL_0017: newobj       instance void [System.Net.Primitives]System.Net.DnsEndPoint::.ctor(string, int32)
  IL_001c: br.s         IL_0025
  IL_001e: ldloc.1      // parsedAddress
  IL_001f: ldarg.2      // port
  IL_0020: newobj       instance void [System.Net.Primitives]System.Net.IPEndPoint::.ctor(class [System.Net.Primitives]System.Net.IPAddress, int32)
  IL_0025: stloc.0      // ep

  // [219 13 - 219 56]
  IL_0026: ldarg.0      // this
  IL_0027: ldloc.0      // ep
  IL_0028: ldarg.3      // cancellationToken
  IL_0029: call         instance valuetype [System.Runtime]System.Threading.Tasks.ValueTask System.Net.Sockets.Socket::ConnectAsync(class [System.Net.Primitives]System.Net.EndPoint, valuetype [System.Runtime]System.Threading.CancellationToken)
  IL_002e: ret
} // end of method Socket::ConnectAsync
```

- 매우 길지만 `ldarg.0`과 `ldarg.1`을 설명하기 위한 IL 코드이다
- 앞서 등장했던 `ldarg`와 `brtrue.s` 등 무엇을 하려는지는 이해를 할 수 있었다

### 궁금했던 점

- 처음에는 당연히 `ldarg.0` 이 host를 의미할 것이라고 생각했다. 그러나 IL코드는 `ldarg.1`이 host를 의미하는 것으로 되어있었고, 매개변수의 인덱싱이 zero-based가 아닌가 생각도 했었다.
- AI를 통해 질문을 해 보았다.
  - "`ldarg.1`이 host인데 `ldarg.0`은 무엇인가? 설마 제로베이스가 아닌건가?"
- 답은 간단했다
  - "인스턴스 메서드는 항상 **`this`** 를 포함하여 `ldarg.0`은 this이다."
- IL에도 당연한 듯이 적혀 있었다 그러나 의미를 몰랐다
  - `IL_0026: ldarg.0   //this`

### 결론

#### 인스턴스 메서드

```cs
class MyClass
{
	public void Method()
	{
		// ...
	}
}
```

- 클래스의 인스턴스를 통해 호출되는 메서드
- 항상 `this`를 매개변수로 포함한다
  - python의 `def method(self, x): ...` 처럼 내부적으로 self가 자동으로 들어가는 구조와 비슷하다
- 특정 인스턴스를 통해 호출하는 인스턴스 매개변수는 `ldarg.0`은 항상 `this` 이고, 이후로 해당 메서드의 매개변수가 차례대로 `ldarg.1`, `ldarg.2`, ... 로 매핑된다

#### 정적 메서드

```cs
class MyClass
{
	public static void Method()
	{
		// ...
	}
}
```

- 클래스 자체에 붙어있는 메서드
- 인스턴스가 존재하지 않음
- `ldarg.0`에 메서드의 첫 번째 인자부터 매핑된다

## 느낀점

- 어찌보면 당연한 얘기인데 C# 지식에 대해서 다시 생각하게되는 계기가 된 것 같다
- IL 코드가 asm 처럼 무작정 어려울 것 같아 시도를 하지 못했었는데 생각보다 읽기 편하고 재미있어서 다행이다
- 이후에는 IL 을 통한 최적화 등 못해본 것들도 도전해 봐야겠다는 생각을 하게 되었다
