<template>
  <div class="import-command">
    <div class="edit-content">
      <div class="list-edit">
        <div class="left">{{ $t('robot_command.import_pop.upload') }}</div>
        <div class="right">
          <label for="fileInput" class="label-input">
            <input type="file" ref="fileChooser" id="fileInput"  accept=".xlsx" @change="validateFile"/>
            <text-button
              button-type="default"
              iconType="choose_file">
              {{ $t('robot_command.import_pop.choose_file') }}
            </text-button>
          </label>
          <text-button
            button-type="default"
            iconType="temp_down"
            @click="downloadTemp">
            {{ $t('robot_command.import_pop.down_temp') }}
          </text-button>
          <div v-if="filename" class="file-name">
            <p>{{ filename }}</p>
            <!-- <p :title="filename">{{ filename }}</p> -->
            <div class="close" @click="removeFile">X</div>
          </div>
        </div>
      </div>
      <div class="list-edit">
        <div class="left">{{ $t('robot_command.import_pop.upload_mode') }}</div>
        <div class="right">
          <div>
          <!-- <div v-tooltip="warnTooltip"> -->
            <el-tooltip effect="dark"
              placement="bottom" >
                <div slot="content" style="line-height: 1.5em; width: 260px;" v-html="$t('robot_command.import_pop.all_replace_tips')"></div>
                <el-radio class="emotibot" v-model="allReplace" label="1" size="mini">{{ $t('robot_command.import_pop.all_replace') }}</el-radio>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="tips-content">
      <h3>{{ $t('general.note') }}</h3>
      <ol>
        <li v-for="(txt, idx) in tips" :key="idx">
          <p>
            {{ txt }}
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
  import tips from '../_data/importCommandTips';


  const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

  export default {
    name: 'ImportCommandPop',
    data() {
      return {
        allReplace: '1',
        readonly: true,
        tips: '',
        warnTooltip: {
          msg: this.$t('robot_command.import_pop.all_replace_tips'),
        },
        filename: '',
        file: undefined,
      };
    },
    mounted() {
      this.setTipsInfo();
      this.$on('validate', this.validate);
    },
    methods: {
      removeFile() {
        this.$refs.fileChooser.value = '';
        this.file = '';
        this.updateFilename('');
      },
      setTipsInfo() {
        this.tips = tips[this.$i18n.locale].content;
      },
      downloadTemp() {
        window.open(`/Files/command_import_template.xlsx?locale=${this.$i18n.locale}`);
      },
      fileTypeInvalid(file) {
        const validType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const suffix = file.name.split('.');
        const ExcelSuffix = 'xlsx';
        const isExecl = suffix && suffix.length > 0 && suffix[suffix.length - 1] === ExcelSuffix;
        return validType.indexOf(file.type) === -1 && !isExecl;
      },
      updateFilename(msg) {
        this.filename = msg || this.file.name;
      },
      validateFile() {
        const theFile = this.$refs.fileChooser.files[0];
        let fileValid = true;
        if (!theFile) {
          fileValid = false;
          this.updateFilename(this.$t('robot_command.import_pop.upload_file_undefined'));
        } else if (theFile.size <= 0 || theFile.size > FILE_SIZE_LIMIT) {
          fileValid = false;
          this.updateFilename(this.$t('robot_command.import_pop.upload_file_size_error'));
        } else if (this.fileTypeInvalid(theFile)) {
          fileValid = false;
          this.updateFilename(this.$t('robot_command.import_pop.upload_file_type_invalid'));
        }
        if (fileValid) {
          this.file = theFile;
          this.updateFilename();
        }
      },
      validate() {
        if (!this.file) {
          this.$notifyFail(this.$t('robot_command.import_pop.tips_choose_file'));
          return;
        }
        const data = new FormData();
        data.append('file', this.file);
        this.$emit('validateSuccess', data);
      },
    },
  };
</script>

<style lang="scss" scoped>

  .import-command {
    @include font-14px();
    width: 660px;
    padding: 0 30px;
    border: {
      top: 1px solid $color-borderline;
      bottom: 1px solid $color-borderline;
    }
  }

  .edit-content {
    padding: 20px 0;
    border-bottom: 1px solid $color-borderline;

    .list-edit {
      display: flex;
      line-height: 28px;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .left {
        flex: 0 0 100px;
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;

        .label-input {
          margin-right: 10px;
          display: flex;
          p {
            margin-left: 10px;
          }
        }

        .file-name {
          margin-left: 10px;
          height: 28px;
          flex: 1;
          display: flex;
          padding: 0px 10px;
          align-items: center;
          justify-content: space-between;
          background: #eeeeee;
          border-radius: 2px;
          font-size: 12px;
          font-family: PingFangHK-Regular;
          font-weight: 400;
          color: #666666;
          line-height: 18px;
          overflow: hidden;

          p {
            overflow-x: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .close {
            cursor: pointer;
          }
        }
      }
    }
  }

  #fileInput {
    display: none;
  }

  .tips-content {
    padding: 20px 0;
    h3 {
      @include font-16px();
      font-weight: bold;
      margin-bottom: 15px;
    }

    ol {
      margin-left: 15px;
      list-style-type: decimal;
      li {
        &:not(:last-child) {
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
