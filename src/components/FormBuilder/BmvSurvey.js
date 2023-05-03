import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import * as Survey from "survey-knockout";
import * as widgets from "surveyjs-widgets";
import category from "./widget/category";
import rgpd from "./widget/rgpd";
import Form from "./connector/Form";
import Step from "./connector/Step";
import { ItemValue } from "survey-vue";

export default class BmvSurvey {
  supportedLocales = ["en", "fr"];

  constructor(divToMount, defaultLang) {
    this.divToMount = divToMount;
    this.surveyCreator = null;

    SurveyCreator.editorLocalization.currentLocale = defaultLang;

    Survey.surveyLocalization.supportedLocales = this.supportedLocales;
    Survey.surveyLocalization.currentLocale = defaultLang;
    Survey.surveyLocalization.defaultLocale = defaultLang;
  }

  init() {
    widgets.ckeditor(Survey);

    var CkEditor_ModalEditor = {
      afterRender: function (modalEditor, htmlElement) {
        var editor = window["CKEDITOR"].replace(htmlElement);
        editor.on("change", function () {
          modalEditor.editingValue = editor.getData();
        });
        editor.setData(modalEditor.editingValue);
      },
      destroy: function (modalEditor, htmlElement) {
        var instance = window["CKEDITOR"].instances[htmlElement.id];
        if (instance) {
          instance.removeAllListeners();
          window["CKEDITOR"].remove(instance);
        }
      },
    };
    SurveyCreator.SurveyPropertyModalEditor.registerCustomWidget(
      "html",
      CkEditor_ModalEditor
    );
    Survey.JsonObject.metaData.addProperties("file", [
      {
        name: "filetype",
        choices: ["Files and medias", "Medias", "Files", "Pictures"],
        category: "general",
        visibleIndex: 5,
      },
      { name: "maximum", propertyType: "number", category: "general" },
      { name: "minimum", propertyType: "number", category: "general" },
    ]);
    Survey.JsonObject.metaData.removeProperty("file", "acceptedTypes");

    var mainColor = "#2C578F";
    var mainHoverColor = "#2C578F";
    var textColor = "#2C578F";
    var defaultThemeColorsEditor =
      SurveyCreator.StylesManager.ThemeColors["default"];
    defaultThemeColorsEditor["$primary-color"] = mainColor;
    defaultThemeColorsEditor["$secondary-color"] = mainColor;
    defaultThemeColorsEditor["$primary-hover-color"] = mainHoverColor;
    defaultThemeColorsEditor["$primary-text-color"] = textColor;
    defaultThemeColorsEditor["$selection-border-color"] = mainColor;

    SurveyCreator.StylesManager.applyTheme("bootstrap");
  }

  addMap(Survey) {
    var widget = {
      name: "map",
      title: "Map",
      iconName: "",
      widgetIsLoaded: function () {
        return true;
      },
      isFit: function (question) {
        return question.getType() === "map";
      },
      activatedByChanged: function (activatedBy) {
        const restrictGeo = {
          fr: "Réstreindre la zone géographique",
          en: "Restrict geographic area",
        };
        Survey.JsonObject.metaData.addClass("map", [], null, "text");
        Survey.JsonObject.metaData.addProperties("map", [
          { name: "latitude", category: "general" },
          { name: "longitude", category: "general" },
          { name: "zoom", category: "general" },
          {
            name: "carte",
            choices: ["satellite", "city"],
            category: "general",
          },
          {
            name: "provider",
            choices: ["Bing", "Maps", "Osm"],
            category: "general",
          },
          {
            name: "country",
            category:
              restrictGeo[SurveyCreator.editorLocalization.currentLocale],
          },
          {
            name: "city",
            category:
              restrictGeo[SurveyCreator.editorLocalization.currentLocale],
          },
        ]);
      },
      isDefaultRender: false,
      htmlTemplate:
        "<div><div id='mapsurvey' style='height:180px;'></div></div>",
      afterRender: function (question, el) {
        var mapEl = el.getElementsByTagName("div")[0];
        var map = L.map(mapEl).setView(
          [48.87510283703279, 2.3672103881835938],
          12
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        L.marker([48.87510283703279, 2.3672103881835938])
          .addTo(map)
          .openPopup();
        map.invalidateSize();
      },
      willUnmount: function (question, el) {},
    };

    let isMap = false;
    Survey.CustomWidgetCollection.Instance.widgets.forEach((widget) => {
      if (widget.name === "map") {
        isMap = true;
      }
    });

    if (!isMap) {
      Survey.CustomWidgetCollection.Instance.addCustomWidget(
        widget,
        "customtype"
      );
    }
  }

  setStore(store) {
    this.store = store;
  }

  loadContent() {
    if (this.surveyCreator) {
      this.surveyCreator.text = localStorage.getItem("survey");
    }
  }

  saveContent() {
    localStorage.setItem("survey", this.surveyCreator.text);
  }

  parseForm(formDb) {
    let form = new Form();
    for (let i = 0; i < formDb.steps.length; i++) {
      let currentStep = formDb.steps[i];
      let step = Step.createInstanceFromDB(currentStep);

      for (let j = 0; j < currentStep.attributes.length; j++) {
        let currentAttribute = currentStep.attributes[j];
        let attribute = form.getMatchingAttributeFromDB(currentAttribute);

        if (attribute) {
          step.addAttribute(attribute);
        }
      }

      form.addStep(step);
    }

    localStorage.setItem("survey", JSON.stringify(form.toSurveyJS()));
  }

  toJson() {
    var surveyjs = JSON.parse(this.surveyCreator.text);
    var form = new Form();
    form.setDefaultLang = this.locale;

    surveyjs.pages.forEach((step, pageIndex) => {
      if (step.elements && step.elements.length > 0) {
        var currentStep = Step.createInstanceFromSurveyJS(step);
        form.addStep(currentStep);

        step.elements.forEach((attribute, stepIndex) => {
          var model = form.getMatchingAttribute(attribute);
          currentStep.addAttribute(model);
        });
      }
    });

    return form.toBackend();
  }

  printContent() {}

  show() {
    let options = {
      haveCommercialLicense: true,
      showEmbededSurveyTab: false,
      showDefaultLanguageInTestSurveyTab: false,
      showQuestionEditor: false,
      showLogicTabValue: false,
      showTranslationTab: true,
      showDesignerTab: true,
      //cacher le JSON editor et le test de questionnaire"
      showJSONEditorTab: true,
      showTestSurveyTab: false,
      questionTypes: [
        "text",
        "checkbox",
        "dropdown",
        "radiogroup",
        "file",
        "map",
        "rgpd",
        "category",
      ],
    };

    this.addMap(Survey);
    category(Survey);
    rgpd(Survey);

    Survey.JsonObject.metaData.removeProperty("itemvalue", "value");

    Survey.JsonObject.metaData.addProperty("itemvalue", {
      name: "icon",
      type: "text",
    });

    Survey.JsonObject.metaData.addClass(
      "itemvalues_ex",
      [{ name: "icon" }],
      function () {
        return new Survey.ItemValue(null);
      },
      "itemvalue"
    );
    Survey.JsonObject.metaData.findProperty("category", "choices").type =
      "itemvalues_ex";

    Survey.JsonObject.metaData.addProperty("itemvalue", {
      name: "operators",
      type: "text",
    });

    Survey.JsonObject.metaData.addClass(
      "operators",
      [{ name: "operators" }],
      function () {
        return new Survey.ItemValue(null);
      },
      "itemvalue"
    );
    Survey.JsonObject.metaData.findProperty("category", "choices").type =
      "operators";

    Survey.JsonObject.metaData.addProperty("itemvalue", {
      name: "informed",
      type: "text",
    });

    Survey.JsonObject.metaData.addClass(
      "informeds",
      [{ name: "informed" }],
      function () {
        return new Survey.ItemValue(null);
      },
      "itemvalue"
    );
    Survey.JsonObject.metaData.findProperty("category", "choices").type =
      "informeds ";

    Survey.JsonObject.metaData.addProperty("question", {
      name: "instruction:text",
      serializationProperty: "locInstruction",
      category: "general",
      visibleIndex: 3,
    });
    let helpName = {
      fr: "Aide",
      en: "Help",
    };
    Survey.JsonObject.metaData.addProperty("question", {
      name: "help:text",
      serializationProperty: "locHelp",
      category: "general",
      visibleIndex: 4,
      displayName: helpName[SurveyCreator.editorLocalization.currentLocale],
    });

    Survey.JsonObject.metaData.addProperty("text", {
      name: "placeholder:text",
      serializationProperty: "locPlaceholder",
      category: "general",
      visibleIndex: 5,
    });

    Survey.JsonObject.metaData.addProperty("dropdown", {
      name: "placeholder:text",
      serializationProperty: "locPlaceholder",
      category: "general",
      visibleIndex: 5,
    });

    let ticketTitleName = {
      fr: "Définir comme titre du ticket",
      en: "Set as ticket title",
    };

    Survey.JsonObject.metaData.addProperty("text", {
      name: "astitle:switch",
      dependsOn: ["inputType"],
      visibleIf: function (obj) {
        return obj.inputType == "texte" || obj.inputType == "text";
      },
      category: "general",
      visibleIndex: 9,
      displayName:
        ticketTitleName[SurveyCreator.editorLocalization.currentLocale],
    });

    let ticketAuthorMailName = {
      fr: "Définir comme destinataire du ticket",
      en: "Set as the ticket recipient",
    };

    Survey.JsonObject.metaData.addProperty("text", {
      name: "asauthor:switch",
      dependsOn: ["inputType"],
      visibleIf: function (obj) {
        return obj.inputType == "email" || obj.inputType == "mail";
      },
      category: "general",
      visibleIndex: 9,
      displayName:
        ticketAuthorMailName[SurveyCreator.editorLocalization.currentLocale],
    });

    let ticketContentName = {
      fr: "Définir comme contenu du ticket",
      en: "Set as ticket content",
    };

    Survey.JsonObject.metaData.addProperty("text", {
      name: "ascontent:switch",
      dependsOn: ["inputType"],
      visibleIf: function (obj) {
        return obj.inputType == "markdown";
      },
      category: "general",
      visibleIndex: 9,
      displayName:
        ticketContentName[SurveyCreator.editorLocalization.currentLocale],
    });

    let privateName = {
      fr: "Avec réponse privée (rgpd) ?",
      en: "With private response ?",
    };

    Survey.JsonObject.metaData.addProperty("question", {
      name: "private:switch",
      category: "general",
      visibleIndex: 9,
      displayName: privateName[SurveyCreator.editorLocalization.currentLocale],
    });

    let ticketRequiredPublic = {
      fr: "Est obligatoire en public?",
      en: "Is required in public?",
    };

    Survey.JsonObject.metaData.addProperty("question", {
      name: "requiredPublic:switch",
      category: "general",
      visibleIndex: 9,
      displayName:
        ticketRequiredPublic[SurveyCreator.editorLocalization.currentLocale],
    });

    let ticketRequiredPrivate = {
      fr: "Est obligatoire en back-office?",
      en: "Is required in back-office?",
    };

    Survey.JsonObject.metaData.addProperty("question", {
      name: "requiredBackoffice:switch",
      category: "general",
      visibleIndex: 9,
      displayName:
        ticketRequiredPrivate[SurveyCreator.editorLocalization.currentLocale],
    });

    let hiddenName = {
      fr: "Est caché pour le citoyen ?",
      en: "Is hidden for the citizen?",
    };

    Survey.JsonObject.metaData.addProperty("question", {
      name: "hidden:switch",
      category: "general",
      visibleIndex: 9,
      displayName: hiddenName[SurveyCreator.editorLocalization.currentLocale],
    });

    Survey.JsonObject.metaData.findProperty(
      "text",
      "inputType"
    ).visibleIndex = 1;

    Survey.JsonObject.metaData.findProperty("text", "inputType").typeValue =
      "string";

    Survey.JsonObject.metaData.findProperty("text", "inputType").choicesValue =
      ["text", "email", "date", "datetime-local", "number", "markdown"];

    this.surveyCreator = new SurveyCreator.SurveyCreator(
      this.divToMount,
      options
    );

    this.surveyCreator.toolbox.removeItem("nouislider");
    this.surveyCreator.toolbox.removeItem("sortablelist");
    this.surveyCreator.toolbox.removeItem("bootstrapslider");

    this.surveyCreator.showToolbox = "right";
    this.surveyCreator.showPropertyGrid = "right";
    this.surveyCreator.rightContainerActiveItem("toolbox");

    var propertyBlackList = [
      "visible",
      "hasComment",
      "commentPlaceHolder",
      "separateSpecialChoices",
      "page",
      "clearIfInvisible",
      "visibleIf",
      "enableIf",
      "requiredIf",
      "bindings",
      "defaultValueExpression",
      "columnsVisibleIf",
      "rowsVisibleIf",
      "hideIfChoicesEmpty",
      "choicesVisibleIf",
      "choicesEnableIf",
      "minValueExpression",
      "maxValueExpression",
      "calculatedValues",
      "triggers",
      "logo",
      "logoWidth",
      "logoHeight",
      "logoFit",
      "logoPosition",
      "cookieName",
      "showPreviewBeforeComplete",
      "showTimerPanel",
      "showTimerPanelMode",
      "showQuestionNumbers",
      "showTimerPanel",
      "showTimerPanelMode",
      "focusFirstQuestionAutomatic",
      "focusOnFirstError",
      "completedHtml",
      "completedBeforeHtml",
      "completedHtmlOnCondition",
      "loadingHtml",
      "triggers",
      "calculatedValues",
      "cookieName",
      "sendResultOnPageNext",
      "showNavigationButtons",
      "showPrevButton",
      "showTitle",
      "showCompletedPage",
      "navigateToUrl",
      "navigateToUrlOnCondition",
      "questionsOrder",
      "showPageNumbers",
      "showQuestionNumbers",
      "questionTitleLocation",
      "questionDescriptionLocation",
      "questionErrorLocation",
      "showProgressBar",
      "progressBarType",
      "mode",
      "storeOthersAsComment",
      "maxTextLength",
      "maxOthersLength",
      "goNextPageAutomatic",
      "clearInvisibleValues",
      "checkErrorsMode",
      "textUpdateMode",
      "autoGrowComment",
      "startSurveyText",
      "pagePrevText",
      "pageNextText",
      "completeText",
      "previewText",
      "editText",
      "requiredText",
      "questionStartIndex",
      "questionTitlePattern",
      "firstPageIsStarted",
      "questionsOnPageMode",
      "showPreviewBeforeComplete",
      "maxTimeToFinish",
      "maxTimeToFinishPage",
      "showTimerPanel",
      "showTimerPanelMode",
      "widthMode",
      "locale",
      "readOnly",
      "navigationButtonsVisibility",
      "navigationTitle",
      "navigationDescription",
      "id",
      "state",
      "useDisplayValuesInTitle",
      "startWithNewLine",
      "indent",
      "hideNumber",
      "valueName",
      "defaultValue",
      "correctAnswer",
      "requiredErrorText",
      "validators",
      "size",
      "min",
      "max",
      "minValueExpression",
      "maxValueExpression",
      "minErrorText",
      "maxErrorText",
      "step",
      "maxLength",
      "placeHolder",
      "dataList",
      "autoComplete",
      "titleLocation",
      "descriptionLocation",
      "minWidth",
      "maxWidth",
      "width",
      "choicesFromQuestion",
      "choicesFromQuestionMode",
      "choicesOrder",
      "choicesByUrl",
      "hideIfChoicesEmpty",
      "choicesVisibleIf",
      "choicesEnableIf",
      "hasOther",
      "otherPlaceHolder",
      "noneText",
      "otherText",
      "otherErrorText",
      "colCount",
      "hasSelectAll",
      "maxSelectedChoices",
      "selectAllText",
      "hasSelectAll",
      "hasNone",
      "optionsCaption",
      "showOptionsCaption",
      "choicesMin",
      "choicesMax",
      "choicesStep",
      "imageFit",
      "imageWidth",
      "imageHeight",
      "contentMode",
      "multiSelect",
      "showLabel",
      "showPreview",
      "waitForUpload",
      "maxSize",
      "needConfirmRemoveFile",
      "storeDataAsText",
      "allowImagesPreview",
      "allowMultiple",
      "isRequired",
    ];
    this.surveyCreator.onShowingProperty.add(function (sender, options) {
      options.canShow = propertyBlackList.indexOf(options.property.name) === -1;
    });

    Survey.Serializer.addProperty("page", {
      name: "id",
    });

    Survey.Serializer.addProperty("question", {
      name: "id",
    });
    //supprimer "sauvegarder le questionnaire dans la barre de menu"
    this.surveyCreator.toolbox.creator.toolbarItems.splice(4, 6);

    this.surveyCreator.bmvSurvey = this;
    this.surveyCreator.saveSurveyFunc = this.printContent;

    return this.surveyCreator;
  }
}
