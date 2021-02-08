<template>
  <div :class="['title-style',{'inactive-section':inactiveSection}]">
    <div>
      <h4>
        {{ title.toUpperCase() }}
      </h4>
      <span class="triangle-bottomLeft" />
      <span class="triangle-bottomRight" />
    </div>
  </div>
</template>

<script>
    export default {
      name: "SectionTitle",
      props: {
          title: {
            default: null,
            type: String
          },
          inactiveSection:{
            default:false,
            type:Boolean
          }
      }
    }
</script>

<style scoped  lang="scss">
  .title-style {
    position: absolute;
    top: -10px;
    background: linear-gradient(#4f5f5d, #00aa8e);
    background: -moz-linear-gradient(#4f5f5d, #00aa8e);
    background: -webkit-linear-gradient(#4f5f5d, #00aa8e);
    background: -o-linear-gradient(#4f5f5d, #00aa8e);
    padding: 1px 10px 1px 10px;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;

    div {
      position: relative;

      h4 {
        font-size: 1rem;
        color: white;
      }

      .triangle-bottomLeft {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: -18px;
        border-bottom: 8px solid #aaaaaa;
        border-left: 8px solid transparent;
      }

      .triangle-bottomRight {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        right: -18px;
        border-bottom: 8px solid #aaaaaa;
        border-right: 8px solid transparent;
      }
    }
  }

  .inactive-section {
    background: lightgrey;
  }
</style>
