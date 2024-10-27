import { inject } from 'vue'

export interface IOffer {
  rtcOffer: RTCSessionDescriptionInit
  callerId: string
}

export interface ISignalingService {
  sendOffer(offer: RTCSessionDescriptionInit): void
  listenForAnswer(listener: (offer: IOffer) => void): void
  listenForIncomingCalls(listener: (offer: IOffer) => void): void
  sendAnswerOffer(offer: RTCSessionDescriptionInit): void
}

export function useSignalingService(): ISignalingService {
  // TODO implement properly. currently a placeholder
  return inject<ISignalingService>('TEST') as ISignalingService
}
