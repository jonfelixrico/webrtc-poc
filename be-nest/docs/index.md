# RTC connection flow

```mermaid
sequenceDiagram
    actor UserA
    actor UserB
    actor WS as Server

    UserA ->>+ WS: command: join<br>payload: { roomId: ABC }
    WS -->>- UserA: event: user_list_synced<br>payload: { clientIds: [UserA], roomId: ABC }
    UserB ->>+ WS: command: join<br>payload: { roomId: ABC }
    WS -->> UserB: event: user_list_synced<br>payload: { clientIds: [UserA, UserB], roomId: ABC }
    WS -->> UserA: event: user_joined<br>payload: { clientId: UserB, roomId: ABC }
    WS -->>- UserA: event: user_list_synced<br>payload: { clientIds: [UserA, UserB], roomId: ABC }
    UserB ->>+ WS: command: send_offer<br>payload: { clientId: UserA, rtcSession: RTCSessionUserB, roomId: ABC }
    Note over UserB, WS: The joiner will do the offer process for each other user in user_list_synced
    WS -->>- UserA: event: offer_sent<br>payload: { clientId: UserB, rtcSession: RTCSessionUserB, roomId: ABC }
    UserA ->>+ WS: command: accept_offer<br>payload: { clientId: UserB, rtcSession: RTCSessionUserA, roomId: ABC }
    WS -->>- UserB: event: offer_accepted<br>payload: { clientId: UserA, rtcSession: RTCSessionUserA, roomId: ABC }
    Note over UserA, UserB: WebRTC handshake is completed at this point
```
