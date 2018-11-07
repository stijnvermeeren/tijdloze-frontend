<template>
    <div class="toelichting">
        <ul>
            <li v-for="text in analyse">
                <tijdloze-links :text="text" />
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    props: ["analyse"]
  }
</script>

