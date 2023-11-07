<script setup>
</script>


<template>
    <div class="absolute inset-0 flex items-center justify-center w-screen h-full bg-black">
        <div class="flex items-center justify-center lds-ripple">
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<style scoped>

  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 8rem;
    height: 8rem;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 4rem;
      left: 4rem;
      width: 0;
      height: 0;
      opacity: 0;
    }
    4.9% {
      top: 4rem;
      left: 4rem;
      width: 0;
      height: 0;
      opacity: 0;
    }
    5% {
      top: 4rem;
      left: 4rem;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 8rem;
      height: 8rem;
      opacity: 0;
    }
  }


</style>