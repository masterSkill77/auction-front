<template>
  <div class="pd-ltr-20 xs-pd-20-10">
    <div class="min-height-200px">
      <div class="row">
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-30">
          <div class="pd-20 card-box height-100-p">
            <div class="profile-photo">
              <a
                href="modal"
                data-toggle="modal"
                data-target="#modal"
                class="edit-avatar"
                ><i class="fa fa-pencil"></i
              ></a>
              <img
                src="/vendors/images/photo1.jpg"
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
                          src="/vendors/images/photo2.jpg"
                          alt="Picture"
                          class=""
                        />
                      </div>
                    </div>
                    <div class="modal-footer">
                      <input
                        type="submit"
                        value="Update"
                        class="btn btn-primary"
                      />
                      <button
                        type="button"
                        class="btn btn-default"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h5 class="text-center h5 mb-0">Ross C. Lopez</h5>
            <p class="text-center text-muted font-14">
              Lorem ipsum dolor sit amet
            </p>
            <ContactInfo />
          </div>
        </div>
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 mb-30">
          <Pannel2 />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Pannel2 from "../../components/UI/pannel-settings/Pannel2.vue";
import ContactInfo from "../../components/UI/pannel-settings/ContactInfo.vue";
</script>
