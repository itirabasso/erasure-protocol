module.exports = {
  NMR: { 
    artifact: "MockNMR",
    address: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671"
  },
  registries: {
    Erasure_Agreements: {
      artifact: "Erasure_Agreements",
      address: '0x348FA9DcFf507B81C7A1d7981244eA92E8c6Af29'
    },
    Erasure_Posts: {
      artifact: "Erasure_Posts",
      address: '0xa6cf4Bf00feF8866e9F3f61C972bA7C687C6eDbF'
    },
    // 0x789D0082B20A929D6fB64EB4c10c68e827AAB7aB
  },
  templates: {
    SimpleGriefing: {
      artifact: "SimpleGriefing",
      address: '0xC04Bd2f0d484b7e0156b21c98B2923Ca8b9ce149'
    },
    CountdownGriefing: {
      artifact: "CountdownGriefing",
      address: '0x89a2958544f86Cc57828dbBf31E2C786f20Fe0a0'
    },
    Feed: {
      artifact: "Feed",
      address: '0xA411eB36538a2Ae060A766221E43A94205460369'
    },
    Post: {
      artifact: "Post",
      address: '0x7f858F0726af676e00cB76459D984463ee1307c2'
    }
  },
  factories: {
    SimpleGriefing: {
      artifact: "SimpleGriefing_Factory",
      address: '0x67ef9503cf0350dB52130Ef2Ad053E868Bc90FC7',
      config: {
        template: "SimpleGriefing", // "SimpleGriefing",
        registry: "Erasure_Agreements"
      }
    },
    CountdownGriefing: {
      artifact: "CountdownGriefing_Factory",
      address: '0xd330e5e9670738D36E31dcb1fde0c08B1895a0b1',
      config: {
        template: "CountdownGriefing",
        registry: "Erasure_Agreements"
      }
    },
    Feed: {
      artifact: "Feed_Factory",
      address: '0x206780873974878722Ed156544589701832eE920',
      config: {
        template: "Feed",
        registry: "Erasure_Posts"
      }
    },
    Post: {
      artifact: "Post_Factory",
      address: '0x41b65f0153410E42ec26eaBa71F9f8f133282B54',
      config: {
        template: "Post",
        registry: "Erasure_Posts"
      }
    }
  }
};
