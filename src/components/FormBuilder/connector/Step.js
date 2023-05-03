import * as SurveyCreator from 'survey-creator'

export default class Step {
  static langs = ['fr', 'en']

  defaultLang = SurveyCreator.editorLocalization.currentLocale

  constructor() {
    this.attributes = []
  }

  static createInstanceFromDB(step) {
    let instance = new Step()

    instance.id = step.id
    instance.title = {}
    instance.description = {}
    instance.name = ''

    for (let i = 0; i < Step.langs.length; i++) {
      let lang = Step.langs[i]

      let key = lang
      if (lang === instance.defaultLang) {
        key = 'default'
      }

      let stepTranslation = step.translations.find(
        (translation) => translation.locale === lang
      )

      instance['title'][key] = stepTranslation.name
      instance['description'][key] = stepTranslation.content
    }

    return instance
  }

  static createInstanceFromSurveyJS(step) {
    let instance = new Step()

    instance.id = typeof step.id === 'string' ? null : step.id ?? null
    instance.attributes = []

    for (let i = 0; i < Step.langs.length; i++) {
      instance[Step.langs[i]] = {}
    }

    instance.localizedString(step.title, 'name')
    instance.localizedString(step.description, 'content')

    return instance
  }

  toBackend() {
    let attributesData = []
    for (let i = 0; i < this.attributes.length; i++) {
      attributesData.push(this.attributes[i].toBackend())
    }
    return {
      id: this.id ?? null,
      en: this['en'],
      fr: this['fr'],
      attributes: attributesData,
    }
  }

  toSurveyJS() {
    let attributesData = []
    for (let i = 0; i < this.attributes.length; i++) {
      attributesData.push(this.attributes[i].toSurveyJS())
    }

    return {
      id: this.id ?? null,
      title: this.title,
      description: this.description,
      elements: attributesData,
    }
  }

  propertyToLang(translatableObject, property) {
    if (!translatableObject) return

    Object.keys(translatableObject).forEach((key) => {
      let lang = key

      if (lang === 'default' || key === '0') lang = 'en'

      if (!this.hasOwnProperty(lang)) {
        this[lang] = {}
      }

      this[lang][property] = translatableObject[key]
    })
  }

  addAttribute(attribute) {
    this.attributes.push(attribute)
  }

  addAttributeAt(attribute, index) {
    this.attributes.splice(index, 0, attribute)
  }

  removeAttribute(index) {
    this.attributes.splice(index, 1)
  }

  localizedString(text, property) {
    for (let i = 0; i < Step.langs.length; i++) {
      this[Step.langs[i]][property] = ''
    }

    //first case : only default lang is set
    // handle {value: 'item1', text: 'default text'}
    if (typeof text === 'string') {
      this[this.defaultLang][property] = text
      Step.langs.forEach((lang) => {
        if (lang !== this.defaultLang) {
          this[lang][property] = null
        }
      })
    }

    //second case : there is at least one language set
    //  (maybe not every languages)
    //  (maybe not the default one)
    // handle { "value": "item2", text: {default: 'default text ', fr: 'i3 fr'} }
    if (typeof text === 'object') {
      for (let i = 0; i < Step.langs.length; i++) {
        let currentLang = Step.langs[i]

        if (text.hasOwnProperty(currentLang)) {
          this[currentLang][property] = text[currentLang]
        } else if (text.hasOwnProperty('default')) {
          this[currentLang][property] = text['default']
        } else {
          this[currentLang][property] = null
        }
      }
    }
  }

  localizedObject(text) {
    //first case : only default lang is set
    // handle {value: 'item1', text: 'default text'}
    if (typeof text === 'string') {
      this.config.options[this.defaultLang].push(text)
      Step.langs.forEach((lang) => {
        if (lang !== this.defaultLang) {
          this.config.options[lang].push(null)
        }
      })
    }

    //second case : there is at least one language set
    //  (maybe not every languages)
    //  (maybe not the default one)
    // handle { "value": "item2", text: {default: 'default text ', fr: 'i3 fr'} }
    if (typeof text === 'object') {
      for (let i = 0; i < Step.langs.length; i++) {
        let currentLang = Step.langs[i]

        if (text.hasOwnProperty(currentLang)) {
          this.config.options[currentLang].push(text[currentLang])
        } else if (text.hasOwnProperty('default')) {
          this.config.options[currentLang].push(text['default'])
        } else {
          this.config.options[currentLang].push(null)
        }
      }
    }
  }
}
