<script lang="tsx">
  import { defineComponent, h, compile } from 'vue';

  export default defineComponent({
    name: 'ArcoIcon',
    props: {
      icon: {
        type: String,
        default: '',
        required: true,
      },
      size: {
        type: Number,
        default: 20,
        required: false,
      },
    },
    setup(props) {
      return () => h(compile(`<${props.icon} size=${props.size} />`));
    },
  });
</script>
