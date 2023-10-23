<template>
  <div class="profile-photo">
    <a href="modal" data-toggle="modal" data-target="#modal" class="edit-avatar"
      ><i class="fa fa-pencil"></i
    ></a>
    <img
      :src="JSON.parse(me.configuration.profile_image)[0].content"
      alt=""
      class="avatar-photo"
    />
    <div
      class="modal fade"
      id="modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalLabel"
      aria-hidden="true"
      style="display: none"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body pd-5">
            <div class="img-container">
              <img
                id="image"
                :src="JSON.parse(me.configuration.profile_image)[0].content"
                alt="Picture"
                class=""
              />
            </div>
          </div>
          <div class="modal-footer">
            <input type="submit" value="Update" class="btn btn-primary" />
            <button type="button" class="btn btn-default" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <h5 class="text-center h5 mb-0">{{ me.name + " " + me.lastname }}</h5>
  <p class="text-center text-muted font-14">{{ me.username }}</p>
  <div class="profile-info">
    <h5 class="mb-20 h5 text-blue">Contact Information</h5>
    <ul>
      <li>
        <span>{{ $t("personnalInfo.email") }}:</span>
        {{ me.email }}
      </li>
      <li>
        <span>{{ $t("personnalInfo.adress") }}:</span>
        {{me.etherum_adress}}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth";

const { me } = storeToRefs(useAuthStore());
</script>
