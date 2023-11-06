# 

- LL(k)-грамматика

### Пример программы

```pascal
var a,b : integer;
    c: integer;
begin
repeat
  c:=c+b;
  b:=1;
  until (b>5)
end.

var a,b : integer;
    c: integer;
begin
  c:=c+b;
  b:=1;
end.

var a,b : integer;
    c: integer;
begin
  c:=1;
end.
```



```

<программа> ::= <объявление переменных>begin<список операторов>end.

<объявление переменных> ::= var <список объявлений>

<список объявлений> ::= <объявление>;<список об>

<список об> ::= ß|<список объявлений>

<объявление> ::= id<об>

<об> ::= :<тип>|,<объявление>

<тип> ::= real | integer | string

<список операторов> ::= <оператор><оп>

<оп> ::= ß|<список операторов>

<оператор> ::= <присваивание>; | <цикл>

<присваивание> ::=  id := <арифметическая операция>

<арифметическая операция> ::= <операнд><ао>

<ао> ::= ß|<арифметический знак><операнд>

<арифметический знак> ::= +|-|*|/

<операнд> ::= id|lit

<цикл> ::= repeat <список операторов> until (<условие>)

<условие> ::= <операнд><условный знак><операнд>

<условный знак> ::= >|<|==

```

---
```
<программа> -> <объявление переменных>begin<список операторов>end.

-> var <список объявлений> begin <цикл> end.

->
  var <объявление>;<список объявлений>
  begin
    repeat <список операторов> until (<условие>)
  end.

->

  var id,<объявление>;
      <объявление>;
  begin
    repeat
      <оператор>
      <список операторов>
    until (<операнд><условный знак><операнд>)
  end.

->

  var id, id: integer;
      id: integer;
  begin
    repeat
      <присваивание>
      <оператор>
    until (<операнд><условный знак><операнд>)
  end.

->

  var id, id: integer;
      id: integer;
  begin
    repeat
      id := <арифметическая операция>
      <присваивание>;
    until (<операнд><условный знак><операнд>)
  end.

->

  var id, id: integer;
      id: integer;
  begin
    repeat
      id := <операнд><арифметический знак><операнд>;
      id := <арифметическая операция>;
    until (<операнд><условный знак><операнд>)
  end.

->

  var id, id: integer;
      id: integer;
  begin
    repeat
      id := id+id;
      id := <операнд>;
    until (<операнд><условный знак><операнд>)
  end.

->

  var id, id: integer;
      id: integer;
  begin
    repeat
      id := id+id;
      id := lit;
    until (id>id)
  end.


