import LocalizedStrings from 'react-native-localization';
import { createContext } from "react";

export const strings = new LocalizedStrings({
  'en': {
    button_add_habit: 'Add habit',
    home_title: 'Home',
    button_switch_latvian: 'Change to Latvian',
    button_switch_english: 'Change to English',
    button_back: 'Back',
    settings_title: 'Settings',
    add_habit_title: 'Add new habit',
    default_habit_title: 'Habit',
    button_delete_habit: 'Delete'
  },
  'lv': {
    button_add_habit: 'Pievienot paradamu',
    home_title: 'Sākums',
    button_switch_latvian: 'Nomainīt uz Latviešu',
    button_switch_english: 'Nomainīt uz Angļu',
    button_back: 'Atpakaļ',
    settings_title: 'Iestatījumi',
    add_habit_title: 'Pievienot jaunu paradumu',
    default_habit_title: 'Paradums',
    button_delete_habit: 'Dzēst'
  }
})

export const ContextStrings = createContext({
  currentLanguage: strings.getLanguage(),
  setCurrentLanguage: (string: string) => {}
});
