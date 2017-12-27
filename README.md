# Tanks! You're welcome!
## Gra przeglądarkowa, inspirowana klasykiem 'Tank City'.
### Wersja multiplayer na dwie osoby: https://tanks-multiplayer.herokuapp.com/

	Użyłem: JavaScript (vanilla, Node.js, Socket.io), HTML5 canvas, Firebase, Heroku.

GRA WSPIERA TYLKO DESKTOPY.

Możliwa rozgrywka w jedną lub dwie osoby. Kliknij "Join game", aby dołączyć do gry / stworzyć nową.
(Nowy gracz zostaje automatycznie dołączony do ostatniej założenej gry, która posiada wolne miejsce. Jeśli takiej nie ma, serwer spróbuje stworzyć nową grę i połączyć z nią gracza.)

Gra toczy się w rundach. W każdej rundzie dostajemy trudniejszych przeciwników: są coraz szybsi, zwiększa się ich ilość i wyrtzymałość (plus 1 co rundę). Ostatnia runda to runda 10, ale jeszcze nikomu nie udało się do niej dojść :)

Za każdy zniszczony czołg dostaje się punkty, tyle punktów jaki jest numer rundy.

Gracz zostaje trafiony przez czołg przeciwnika = strata 1 życia. (gracz posiada na start 5 żyć; friendly-fire off)

Gracz straci wszystkie 5 żyć = koniec gry dla gracza.

Kolizja z czołgiem przeciwnikiem = koniec gry dla gracza.

Zniszczenie orzełka = koniec gry dla obu graczy.
