<template>
    <div>
        <p>Alle suggesties, verbeteringen of andere berichten zijn van harte welkom!</p>
    </div>
</template>

<script>
  export default {
    beforeRouteEnter(to, from, next) {
      next(vm => {
        document.title = "Contact";
      });
    }
  }
</script>