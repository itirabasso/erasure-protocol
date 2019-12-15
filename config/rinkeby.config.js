module.exports = {
  contracts: {
    MockNMR: {
      type: 'token',
      artifact: 'MockNMR',
      address: '0x1A758E75d1082BAab0A934AFC7ED27Dbf6282373',
    },
    Erasure_Agreements: {
      type: 'registry',
      artifact: 'Erasure_Agreements',
      address: '0xf46D714e39b742E22eB0363FE5D727E3C0a8BEcC',
    },
    Erasure_Posts: {
      type: 'registry',
      artifact: 'Erasure_Posts',
      address: '0x57EB544cCA126D356FFe19D732A79Db494ba09b1',
    },
    Erasure_Users: {
      type: 'registry',
      artifact: 'Erasure_Users',
      address: '0xbF7339e68b81a1261FDF46FDBe916cd88f3609c0',
    },
    Erasure_Escrows: {
      type: 'registry',
      artifact: 'Erasure_Escrows',
      address: '0xFD6a8b50B7D97133B03f48a08E9BEF5f664e092c',
    },
    Feed: {
      type: 'template',
      artifact: 'Feed',
      address: '0x91faaf60aadcce295e2a99b98dd77421f3517f16',
    },
    SimpleGriefing: {
      type: 'template',
      artifact: 'SimpleGriefing',
      address: '0x1f1e4Fb5E496910A0A0EeeBF979A49E69cd11321',
    },
    CountdownGriefing: {
      type: 'template',
      artifact: 'CountdownGriefing',
      address: '0xaD4Fe9BB39C92E145eD200E19E5C475F7ab0A100',
    },
    CountdownGriefingEscrow: {
      type: 'template',
      artifact: 'CountdownGriefingEscrow',
      address: '0x4cC2FBBB2e93c5bffd09Ac9177D65Db95F649daC',
    },
    Feed_Factory: {
      type: 'factory',
      artifact: 'Feed_Factory',
      address: '0xDE19C478b2eD51668e36704b2341b81DEBFe2c40',
      template: 'Feed',
      registry: 'Erasure_Posts',
    },
    SimpleGriefing_Factory: {
      type: 'factory',
      artifact: 'SimpleGriefing_Factory',
      address: '0x4e278036DB69b7D96352Bc3cdB89B5eE7d31E2a6',
      template: 'SimpleGriefing',
      registry: 'Erasure_Agreements',
    },
    CountdownGriefing_Factory: {
      type: 'factory',
      artifact: 'CountdownGriefing_Factory',
      address: '0x2523f1195537626317Bc0b07e29Afb9F704B510e',
      template: 'CountdownGriefing',
      registry: 'Erasure_Agreements',
    },
    CountdownGriefingEscrow_Factory: {
      type: 'factory',
      artifact: 'CountdownGriefingEscrow_Factory',
      address: '0xE11290a6841198423198744d1222401a2aa5C3d0',
      template: 'CountdownGriefingEscrow',
      registry: 'Erasure_Agreements',
    },
  },
}
