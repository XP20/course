import { RiveAvatar } from "./interfaces/RiveAvatar";

export const riveAvatars: RiveAvatar[] = [
  {
    name: 'Truck',
    animations: [
      'curves',
      'idle'
    ],
    actions: [
      {
        stateMachineName: 'bumpy',
        inputName: 'bump',
        isToggle: false
      }
    ]
  },
  {
    name: 'Jeep',
    animations: [
      'idle',
      'rainy',
      'bouncing',
      'windshield_wipers',
      'broken'
    ],
    actions: [
      {
        stateMachineName: 'weather',
        inputName: 'Raining',
        isToggle: true
      }
    ]
  }
];
