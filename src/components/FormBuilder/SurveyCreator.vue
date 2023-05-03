<template>
  <div>
    <!--    <svg style='display:none;'>-->
    <!--      <symbol viewBox="0 0 16 16" class="w-100 h-100" id="ap">-->
    <!--        <path xmlns="http://www.w3.org/2000/svg" d="M28.292 1.326C27.226 1.116 26.127 1 25 1c-4.71 0-8.98 1.93-12.06 5.04l6.92 5.592L28.292 1.326zM18.595 13.178L11.62 7.55C9.35 10.43 8 14.07 8 18c0 2.281.452 4.487 1.304 6.534L18.595 13.178zM22.608 11.432C23.353 11.159 24.154 11 25 11c3.87 0 7 3.13 7 7 0 .338-.032.667-.078.992l7.772-9.499c-2.058-3.539-5.348-6.268-9.285-7.595L22.608 11.432zM27.341 24.591C26.608 24.851 25.822 25 25 25c-3.87 0-7-3.13-7-7 0-.354.034-.7.084-1.039l-7.803 9.537c.386.666.809 1.315 1.289 1.932.37.5.87 1.14 1.45 1.89 1.267 1.633 2.959 3.816 4.59 6.164L27.341 24.591zM18.778 38.215c2.082 3.184 3.852 6.497 4.172 9.055.14.99.99 1.73 1.99 1.73 1.02 0 1.87-.75 1.99-1.75.61-4.83 6.57-12.48 9.78-16.6.56-.72 1.05-1.35 1.5-1.94C40.65 25.69 42 21.89 42 18c0-2.322-.471-4.536-1.319-6.555L18.778 38.215z"/>-->
    <!--      </symbol>l>-->
    <!--    </svg>-->
    <!-- <div id="test"></div> -->
    <div id="surveyCreatorContainer"></div>
  </div>
</template>

<style>

#test{
  display: flex;
  justify-content: center;
  position: relative;
  z-index:10;
}
.svd_commercial_container {
  display: none !important;
}

/*!* page : cacher le bouton copier *!*/
/*.sv_main :nth-child(5n) {*/
/*  display: none;*/
/*}*/

/* page : enlever le padding autour de la page */
.svd_container .svd_content {
  padding: 0 !important;
}
/* page : ajouter un padding à gauche des questions */
.svd_page {
  padding-left: 2%;
}

/* page :taille des inputs" */
.svd_container
  .svd_content
  .svd_survey_designer
  .svd_editors
  .svd_questions_editor
  .panel-body
  .svd_question,
.svd_container
  .svd_content
  .svd_survey_designer
  .svd_editors
  .svd_questions_editor
  .card-block
  .svd_question
  .form-control {
  width: 98%;
}

/* priopriétés : taille champ "est visible" */
.sjs-cb-wrapper {
  width: 100%;
}
/* priopriétés : padding et taille du conteneur" */
.svd-designer-container {
  padding-left: 0;
}
.svd-designer-container {
  width: 98%;
}
/* priopriétés :taille des inputs" */

.svd_object_editor .form-control {
  max-width: 95%;
}
</style>

<script>
// import { mapActions } from 'vuex'

export default {
  name: 'SurveyCreator',
  props: ['survey'],
  data() {
    return {}
  },
  created() {
    // let element = document.querySelector('.svd-toolbar-dropdown__select')
  },
  methods: {
    //   ...mapActions('auth', {
    //     searchUser: 'searchUser',
    //   }),
    //   search: function (search) {
    //     this.searchUser(search).then((response) => {
    //       operators = response.data.users
    //     })
    //   },
  },
  mounted() {
    this.survey.show()
    this.survey.loadContent()
  },
}
</script>

<style>
.icon-picker-list {
  display: flex;
  flex-flow: row wrap;
  list-style: none;
  padding-left: 0;
}

.icon-picker-list li {
  display: flex;
  flex: 0 0 20%;
  float: left;
  width: 20%;
}

.icon-picker-list a {
  background-color: #f9f9f9;
  border: 1px solid #fff;
  color: black;
  display: block;
  flex: 1 1 auto;
  font-size: 12px;
  line-height: 1.4;
  min-height: 100px;
  padding: 10px;
  text-align: center;
  user-select: none;
}

.icon-picker-list a:hover,
.icon-picker-list a.active {
  background-color: #009e49;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}

.icon-picker-list .fa {
  font-size: 24px;
  margin-bottom: 10px;
  margin-top: 5px;
}

.icon-picker-list .name-class {
  display: block;
  text-align: center;
  word-wrap: break-word;
}
</style>
