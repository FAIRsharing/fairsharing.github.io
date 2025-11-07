import { mapActions } from "vuex";

const onScrollUtil = {
  methods: {
    ...mapActions("uiController", ["setScrollStatus", "setStickToTop"]),

    onScroll(data) {
      let _module = this;
      let offsetTop = 0;
      offsetTop = window.top.scrollY;
      if (offsetTop > 100 && data.length > 1) {
        _module.setStickToTop(true);
        _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
          headerVisibilityState: false,
        });
      } else {
        _module.setStickToTop(false);
        _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
          drawerVisibilityState: false,
          headerVisibilityState: true,
        });
      }
      offsetTop > 500
        ? _module.setScrollStatus(true)
        : _module.setScrollStatus(false);
    },
  },
};

export default onScrollUtil;
