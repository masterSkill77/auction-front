<template>
  <div
    class="login-page register-page-wrap d-flex align-items-center flex-wrap justify-content-center"
  >
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-6 col-lg-6">
          <img src="vendors/images/register-page-img.png" alt="" />
        </div>
        <div class="col-md-6 col-lg-6">
          <div class="register-box-5 p-2 bg-white box-shadow border-radius-10">
            <div id="survey" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "survey-core/modern.min.css";

import "survey-creator-core/survey-creator-core.i18n";
import { SurveyCreator } from "survey-creator-knockout";
import "survey-core/survey.i18n";
import { Survey } from "survey-knockout-ui";
import axios from "@/src/axios";
import { surveyLocalization, StylesManager, Model } from "survey-core";
StylesManager.applyTheme("modern");
surveyLocalization.supportedLocales = ["en", "fr"];
surveyLocalization.currentLocale = "fr";
import { localization } from "survey-creator-core";
localization.currentLocale = "fr";
// ...

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  showTranslationTab: true,
};

export default {
  name: "survey-creator",
  components: {
    Survey,
  },
  data() {
    const survey = new Model(
      JSON.parse(window.localStorage.getItem("survey-json"))
    );
    return {
      survey,
    };
  },
  methods: {
    onComplete(sender) {
      console.log(sender.data);
    },
  },
  async mounted() {
    const surveyJSON = await axios
      .get("/form/1")
      .then(({ data }) => data.form_content);

    const survey = new Survey(JSON.parse(surveyJSON));
    survey.render("survey");
    survey.onComplete.add(this.onComplete);
    // const creator = new SurveyCreator(creatorOptions);
    // creator.text = window.localStorage.getItem("survey-json");
    // creator.saveSurveyFunc = (saveNo, callback) => {
    //   // If you use localStorage:
    //   window.localStorage.setItem("survey-json", creator.text);
    //   callback(saveNo, true);
    //   // If you use a web service:
    //   // saveSurveyJson(
    //   //     "https://your-web-service.com/",
    //   //     creator.JSON,
    //   //     saveNo,
    //   //     callback
    //   // );
    // };
    // creator.render("surveyCreator");
  },
};
</script>
<style scoped>
:root {
  --wizard-stepper--active: rgba(29, 27, 8, 0.479);
  --wizard-line-color: black;
}

#surveyCreator {
  height: 100vh;
  width: 100vw;
}
</style>
