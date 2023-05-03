import * as SurveyCreator from 'survey-creator'

export default class Attribute {
    static type = {
        SMALLTEXT: 1,
        HIDDEN: 2,
        TEXTAREA: 3,
        MARKDOWN: 4,
        NUMBER: 5,
        LOCATION: 6,
        DATE: 7,
        DATETIME: 8,
        SELECT: 9,
        RADIO: 10,
        CHECKBOX: 11,
        FILEUPLOAD: 12,
        CATEGORY: 13,
        GDPR: 14,
        QUERY: 15,
        EMAIL: 16,
        RATING: 17
    }

    static surveyType = {
        1: 'text',
        2: '',
        3: 'text',
        4: 'text',
        5: 'text',
        6: 'map',
        7: 'text',
        8: 'text',
        9: 'dropdown',
        10: 'radiogroup',
        11: 'checkbox',
        12: 'file',
        13: 'category',
        14: 'rgpd',
        15: '',
        16: 'text',
        17: ''
    }

    langs = ['fr', 'en']
    defaultLang = SurveyCreator.editorLocalization.currentLocale

    constructor() {
        this.config = {}
    }

    static createInstanceFromDB(attribute) {
        let instance = new Attribute()

        instance.id = attribute.id
        instance.title = {}
        instance.description = {}
        instance.instruction = {}
        instance.help = {}
        instance.inputType = ''
        instance.placeholder = {}

        for (let i = 0; i < instance.langs.length; i++) {
            let lang = instance.langs[i]

            let key = lang
            if (lang === instance.defaultLang) {
                key = 'default'
            }
            let stepTranslation = attribute.translations.find(
                (translation) => translation.locale === lang
            )
            instance['title'][key] = stepTranslation.label
            instance['description'][key] = stepTranslation.description
            instance['instruction'][key] = stepTranslation.instruction
            instance['help'][key] = stepTranslation.help
            if (instance['placeholder'] && attribute.config.placeholder) {
                instance['placeholder'][key] = Object.keys(
                    attribute.config
                ).includes('placeholder')
                    ? Object.keys(attribute.config.placeholder).includes(lang)
                        ? attribute.config.placeholder[lang][0]
                        : ''
                    : ''
            }
        }
        instance['hidden'] = attribute.hidden === 1 ? true : false
        instance['private'] = attribute.response_private === 1 ? true : false
        instance['requiredBackoffice'] =
            attribute.requiredBackoffice == 1 ? true : false
        instance['requiredPublic'] =
            attribute.requiredPublic == 1 ? true : false

        if (attribute.config.type) {
            instance.inputType = attribute.config.type
            instance['astitle'] = attribute.config.as === 'title' ? true : false
            instance['asauthor'] =
                attribute.config.as === 'author_email' ? true : false
            instance['ascontent'] =
                attribute.config.as === 'content' ? true : false
        }

        switch (attribute.form_attribute_type_id) {
            case 16:
                instance.inputType = 'email'
                break
            case 1:
                instance.inputType = 'text'
                break
            case 4:
                instance.inputType = 'markdown'
                break
            case 5:
                instance.inputType = 'number'
                break
            case 8:
                instance.inputType = 'datetime-local'
                break
            case 7:
                instance.inputType = 'date'
                break
        }
        return instance
    }

    static createInstanceFromSurveyJS(attribute) {
        let instance = new Attribute()
        instance.id =
            typeof attribute.id === 'string' ? null : attribute.id ?? null

        instance.attribute = attribute
        instance.config.options = {}

        if (attribute.hasOwnProperty('placeholder')) {
            instance.config['placeholder'] = {}
        }

        for (let i = 0; i < instance.langs.length; i++) {
            instance.config.options[instance.langs[i]] = []
        }

        for (let i = 0; i < instance.langs.length; i++) {
            if (attribute.type != 'map' && attribute.type != 'file') {
                if (
                    attribute.type == 'dropdown' ||
                    attribute.type == 'checkbox' ||
                    attribute.type == 'radiogroup'
                ) {
                    for (let j = 0; j < attribute.choices.length; j++) {
                        if (typeof attribute.choices[j].text === 'string') {
                            if (
                                !instance.config.options[
                                    instance.defaultLang
                                ].includes(attribute.choices[j].text)
                            ) {
                                instance.config.options[
                                    instance.defaultLang
                                ].push(attribute.choices[j].text)
                            }
                        } else {
                            Object.keys(attribute.choices[j].text).forEach(
                                (lang) => {
                                    if (lang === 'default') {
                                        if (
                                            !instance.config.options[
                                                instance.defaultLang
                                            ].includes(
                                                attribute.choices[j].text[lang]
                                            )
                                        ) {
                                            instance.config.options[
                                                instance.defaultLang
                                            ].push(
                                                attribute.choices[j].text[lang]
                                            )
                                        }
                                    } else {
                                        if (
                                            !instance.config.options[
                                                lang
                                            ].includes(
                                                attribute.choices[j].text[lang]
                                            )
                                        ) {
                                            instance.config.options[lang].push(
                                                attribute.choices[j].text[lang]
                                            )
                                        }
                                    }
                                }
                            )
                        }
                    }
                    if (attribute.type == 'dropdown') {
                        if (typeof attribute.placeholder === 'string') {
                            instance.config.placeholder[instance.defaultLang] =
                                []
                            instance.config.placeholder[
                                instance.defaultLang
                            ].push(attribute.placeholder)
                        } else if (
                            Object.keys(attribute).includes('placeholder')
                        ) {
                            let currentLang = instance.langs[i]

                            if (
                                attribute.placeholder.hasOwnProperty(
                                    currentLang
                                )
                            ) {
                                instance.config.placeholder[currentLang] = []
                                instance.config.placeholder[currentLang].push(
                                    attribute.placeholder[currentLang]
                                )
                            } else if (
                                attribute.placeholder.hasOwnProperty('default')
                            ) {
                                instance.config.placeholder[currentLang] = []
                                instance.config.placeholder[currentLang].push(
                                    attribute.placeholder['default']
                                )
                            }
                        }
                    }

                    if (
                        instance.config.options[instance.langs[i]].length == 0
                    ) {
                        delete instance.config.options[instance.langs[i]]
                    }
                }

                if (attribute.type == 'category') {
                    for (let j = 0; j < attribute.choices.length; j++) {
                        const arrDefaultLang =
                            instance.config.options[instance.defaultLang]

                        if (typeof attribute.choices[j].text === 'string') {
                            const val = {
                                icon: attribute.choices[j].icon
                                    ? attribute.choices[j].icon
                                    : 'fa-solid fa-folder',
                                operators: attribute.choices[j].operators
                                    ? attribute.choices[j].operators
                                    : null,
                                informed: attribute.choices[j].informed
                                    ? attribute.choices[j].informed
                                    : null,
                                label: attribute.choices[j].text
                            }
                            const index = arrDefaultLang.findIndex(
                                (object) => object.label === val.label
                            )

                            if (index === -1) {
                                instance.config.options[
                                    instance.defaultLang
                                ].push(val)
                            }
                        } else {
                            Object.keys(attribute.choices[j].text).forEach(
                                (lang) => {
                                    const val = {
                                        icon: attribute.choices[j].icon
                                            ? attribute.choices[j].icon
                                            : 'fa-solid fa-folder',
                                        operators: attribute.choices[j]
                                            .operators
                                            ? attribute.choices[j].operators
                                            : null,
                                        informed: attribute.choices[j].informed
                                            ? attribute.choices[j].informed
                                            : null,
                                        label: attribute.choices[j].text[lang]
                                    }

                                    if (lang === 'default') {
                                        const index = arrDefaultLang.findIndex(
                                            (object) =>
                                                object.label === val.label
                                        )

                                        if (index === -1) {
                                            instance.config.options[
                                                instance.defaultLang
                                            ].push(val)
                                        }
                                    } else {
                                        const arrLang =
                                            instance.config.options[lang]
                                        const index = arrLang.findIndex(
                                            (object) =>
                                                object.label === val.label
                                        )

                                        if (index === -1) {
                                            instance.config.options[lang].push(
                                                val
                                            )
                                        }
                                    }
                                }
                            )
                        }
                    }

                    if (
                        instance.config.options[instance.langs[i]].length == 0
                    ) {
                        delete instance.config.options[instance.langs[i]]
                    }
                }
                if (attribute.type == 'text') {
                    if (attribute.inputType) {
                        instance.config.type = attribute.inputType
                    } else {
                        instance.config.type = 'text'
                    }
                    instance.config.as = []
                    Object.keys(attribute).includes('astitle')
                        ? (instance.config.as = 'title')
                        : ''
                    Object.keys(attribute).includes('asauthor')
                        ? (instance.config.as = 'author_email')
                        : ''
                    Object.keys(attribute).includes('ascontent')
                        ? (instance.config.as = 'content')
                        : ''

                    if (typeof attribute.placeholder === 'string') {
                        instance.config.placeholder[instance.defaultLang] = []
                        instance.config.placeholder[instance.defaultLang].push(
                            attribute.placeholder
                        )
                    } else if (Object.keys(attribute).includes('placeholder')) {
                        let currentLang = instance.langs[i]

                        if (attribute.placeholder.hasOwnProperty(currentLang)) {
                            instance.config.placeholder[currentLang] = []
                            instance.config.placeholder[currentLang].push(
                                attribute.placeholder[currentLang]
                            )
                        } else if (
                            attribute.placeholder.hasOwnProperty('default')
                        ) {
                            instance.config.placeholder[currentLang] = []
                            instance.config.placeholder[currentLang].push(
                                attribute.placeholder['default']
                            )
                        }
                    }
                }
            } else if (attribute.type == 'map') {
                instance.config = {
                    cardinality: null,
                    default_value: '',
                    map: {
                        config: {
                            center: [
                                parseInt(attribute.latitude),
                                parseInt(attribute.longitude)
                            ],
                            type: attribute.provider.toLowerCase(),
                            zoom: parseInt(attribute.zoom),
                            restriction: {
                                city: attribute.city,
                                country: attribute.country
                            }
                        },
                        pois: [],
                        restrict: {
                            cities: []
                        }
                    }
                }
            } else if (attribute.type == 'file') {
                instance.config = {
                    max: attribute.maximum,
                    min: attribute.minimum,
                    type: 'files and medias'
                }

                if (attribute.filetype) {
                    instance.config.type = attribute.filetype.toLowerCase()
                    switch (instance.config.type) {
                        case 'files and medias':
                            attribute.acceptedTypes =
                                'pdf, png, jpg, jpeg, mp3, wav, mp4, mpg, mpeg, avi, PDF, PNG, JPG, JPEG, MP3, WAV, MP4, MPG, MPEG, AVI'
                            break
                        case 'medias':
                            attribute.acceptedTypes =
                                'png, jpg, jpeg, mp3, wav, mp4, mpg, mpeg, avi, PNG, JPG, JPEG, MP3, WAV, MP4, MPG, MPEG, AVI'
                            break
                        case 'pictures':
                            attribute.acceptedTypes =
                                'png, jpg, jpeg, PNG, JPG, JPEG'
                            break
                        case 'files':
                            attribute.acceptedTypes = 'pdf, PDF'
                            break
                    }
                    instance.config['accepted-ext'] =
                        attribute.acceptedTypes.split(',')
                }
            }
            instance[instance.langs[i]] = {}
        }

        if (attribute.title) {
            instance.localizedString(attribute.title, 'label')
        } else {
            if (attribute.name) {
                instance.localizedString(attribute.name, 'label')
            }
        }

        if (attribute.description) {
            instance.localizedString(attribute.description, 'description')
        }

        if (attribute.instruction) {
            instance.localizedString(attribute.instruction, 'instruction')
        }

        if (attribute.help) {
            instance.localizedString(attribute.help, 'help')
        }
        instance.requiredPublic = Object.keys(attribute).includes(
            'requiredPublic'
        )
            ? true
            : false

        instance.requiredBackoffice = Object.keys(attribute).includes(
            'requiredBackoffice'
        )
            ? true
            : false

        instance.hidden = Object.keys(attribute).includes('hidden')
            ? true
            : false

        instance.private = Object.keys(attribute).includes('private')
            ? true
            : false

        return instance
    }

    toBackend() {
        return {
            id: this.id ?? null,
            form_attribute_type_id: this.form_attribute_type_id,
            hidden: this.hidden,
            private: this.private,
            config: this.config,
            en: this['en'],
            fr: this['fr'],
            requiredPublic: this.requiredPublic,
            requiredBackoffice: this.requiredBackoffice
        }
    }

    toSurveyJS() {
        return {
            id: this.id ?? null,
            type: Attribute.surveyType[this.form_attribute_type_id],
            name: this.name,
            title: this.title,
            description: this.description,
            instruction: this.instruction,
            placeholder: this.placeholder ?? '',
            hidden: this.hidden ?? null,
            private: this.private ?? null,
            astitle: this.astitle ?? null,
            ascontent: this.ascontent ?? null,
            asauthor: this.asauthor ?? null,
            help: this.help,
            choices: this.choices ?? null,
            latitude: this.latitude ?? null,
            longitude: this.longitude ?? null,
            city: this.city ?? null,
            country: this.country ?? null,
            zoom: this.zoom ?? null,
            provider: this.provider ?? null,
            acceptedTypes: this.acceptedTypes ?? null,
            maximum: this.maximum ?? null,
            filetype: this.filetype ?? null,
            minimum: this.minimum ?? null,
            inputType: this.inputType ?? null,
            requiredPublic: this.requiredPublic ?? null,
            requiredBackoffice: this.requiredBackoffice ?? null
        }
    }

    localizedString(text, property) {
        for (let i = 0; i < this.langs.length; i++) {
            this[this.langs[i]][property] = ''
        }

        //first case : only default lang is set
        // handle {value: 'item1', text: 'default text'}
        if (typeof text === 'string') {
            this[this.defaultLang][property] = text
            this.langs.forEach((lang) => {
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
            for (let i = 0; i < this.langs.length; i++) {
                let currentLang = this.langs[i]

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
            this.langs.forEach((lang) => {
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
            for (let i = 0; i < this.langs.length; i++) {
                let currentLang = this.langs[i]

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

    // Cette fonction a été supprimée entre deux commit, je le laisse cependant au cas où ...
    propertyToLang(
        translatableObjectFrom,
        translatableObjectTo,
        property,
        pushable = false
    ) {
        if (!translatableObjectFrom) return

        Object.keys(translatableObjectFrom).forEach((key) => {
            let lang = key

            if (lang === 'default' || key === '0') lang = this.defaultLang

            if (!translatableObjectFrom.hasOwnProperty(lang)) {
                translatableObjectTo[lang] = {}
            }

            if (!translatableObjectTo.hasOwnProperty(property)) {
                translatableObjectTo[lang][property] = pushable ? [] : {}
            }

            if (pushable) {
                translatableObjectTo[lang][property].push(
                    translatableObjectFrom[key]
                )
            } else {
                translatableObjectTo[lang][property] =
                    translatableObjectFrom[key]
            }
        })
    }
}
