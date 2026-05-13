export default {
  edgekeyIncrease() {
    const edge = {
      actions: [
        {
          function: {
            content: {
              key: 'sys_tts_silent_input_counter',
              operation: 'set_key_increase',
              val: '1',
            },
            function_name: 'assign_value',
          },
          source: 'global_info',
          type: 'assign_value',
        },
      ],
      condition_rules: [
        {
          function: {
            content: {
              compare: '==',
              key: 'sys_tts_silent_input',
              val: '1',
            },
            function_name: 'key_val_match',
          },
          source: 'global_info',
        },
      ],
      edge_type: 'normal_2.0',
      logic: 'AND',
      to_node_id: null,
      to_node_labels: [],
      to_node_labels_enable: false,
    };
    return edge;
  },
  edgeRemoveKey() {
    const edge = {
      actions: [
        {
          function: {
            content: 'sys_tts_silent_input_counter',
            function_name: 'remove_key',
          },
          source: 'global_info',
          type: 'remove_key',
        },
      ],
      condition_rules: [
        {
          function: {
            content: {
              key: 'sys_tts_silent_input',
            },
            function_name: 'not_contain_key',
          },
          source: 'global_info',
        },
        {
          function: {
            content: {
              compare: '!=',
              key: 'sys_tts_silent_input',
              val: '1',
            },
            function_name: 'key_val_match',
          },
          source: 'global_info',
        },
      ],
      edge_type: 'normal_2.0',
      logic: 'OR',
      to_node_id: null,
      to_node_labels: [],
      to_node_labels_enable: false,
    };
    return edge;
  },
  exitSpeech(ttsInfo) {
    // let type = '';
    // if (ttsInfo.silence.silence_default) {
    //   type = 'tts_silent_exit_speech_default';
    // } else {
    //   type = 'tts_silent_exit_speech';
    // }
    const edge = {
      actions: [
        {
          function: {
            content: {
              msg: ttsInfo.silence.stop_speech,
              replace: true,
              type: '',
            },
            function_name: 'response_msg',
          },
          source: 'text',
          type: 'response_msg',
        },
      ],
      condition_rules: [
        {
          function: {
            content: {
              compare: '>=',
              key: 'sys_tts_silent_input_counter',
              val: ttsInfo.silence.num_limit,
            },
            function_name: 'key_val_match',
          },
          source: 'global_info',
        },
      ],
      edge_type: 'normal_2.0',
      logic: 'AND',
      to_node_id: '0',
      to_node_labels: [],
      to_node_labels_enable: false,
    };
    return edge;
  },
  silentSpeech(ttsInfo) {
    // let type = '';
    // if (ttsInfo.silence.silence_default) {
    //   type = 'tts_silent_speech_default';
    // } else {
    //   type = 'tts_silent_speech';
    // }
    const edge = {
      actions: [
        {
          function: {
            content: {
              msg: ttsInfo.silence.slient_speech,
              replace: true,
              type: '',
            },
            function_name: 'response_msg',
          },
          source: 'text',
          type: 'response_msg',
        },
        {
          function: {
            content: {
              key: 'sys_node_dialogue_cnt',
              operation: 'set_key_increase',
              val: '-1',
            },
            function_name: 'assign_value',
          },
          source: 'global_info',
          type: 'assign_value',
        },
      ],
      condition_rules: [
        {
          function: {
            content: {
              key: 'sys_tts_silent_input_counter',
            },
            function_name: 'contain_key',
          },
          source: 'global_info',
        },
      ],
      edge_type: 'normal_2.0',
      logic: 'AND',
      to_node_id: '-1',
      to_node_labels: [],
      to_node_labels_enable: false,
    };
    return edge;
  },
  bargeinParser() {
    const edge = {
      edge_type: 'normal_2.0',
      logic: 'AND',
      to_node_id: null,
      to_node_labels: [],
      to_node_labels_enable: false,
      actions: [
        {
          source: 'global_info',
          type: 'remove_key',
          function: {
            content: 'sys_tts_barge_in',
            function_name: 'remove_key',
          },
        },
        {
          source: 'text',
          type: 'parser',
          function: {
            function_name: 'nlu_parser',
            content: {
              tags: 'WAIT',
              key_suffix: '_208710081709488',
              has_context: false,
            },
          },
          parser: 'nlu_parser',
          nluType: 'wait',
        },
      ],
      condition_rules: [],
    };
    return edge;
  },
  bargeinEdge(ttsInfo) {
    // let type = '';
    // if (ttsInfo.bargein.bargein_default) {
    //   type = 'tts_bargein_speech_default';
    // } else {
    //   type = ' tts_bargein_speech';
    // }
    const edge = {
      edge_type: 'normal_2.0',
      logic: 'AND',
      to_node_id: '-1',
      to_node_labels: [],
      to_node_labels_enable: false,
      actions: [
        {
          source: 'text',
          type: 'response_msg',
          function: {
            content: {
              msg: ttsInfo.bargein.bargein_speech,
              replace: ttsInfo.bargein.bargein_value,
              type: '',
            },
            function_name: 'response_msg',
          },
        },
      ],
      condition_rules: [
        {
          function: {
            content: {
              key: 'sys_tts_barge_in',
            },
            function_name: 'contain_key',
          },
          source: 'global_info',
        },
        {
          function: {
            content: {
              compare: '==',
              key: 'sys_tts_barge_in',
              val: 'inform-wait',
            },
            function_name: 'key_val_match',
          },
          source: 'global_info',
        },
      ],
    };
    return edge;
  },
};
