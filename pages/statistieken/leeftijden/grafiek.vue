<template>
    <div>
        <TijdlozeAgesGraph />

        <div class="legende">
            <ul>
                <li>Hoe breder het lijntje, hoe ouder het nummer, relatief met het jaar van de Tijdloze.</li>
            </ul>
        </div>
    </div>
</template>

<script>
  import AgesGraph from "../../../components/d3/AgesGraph"

  export default {
    components: {
      TijdlozeAgesGraph: AgesGraph
    }
  }
</script>


<style lang="less" scoped>
    @import "../../../assets/styleConfig";

    div.legende {
        ul {
            .noBullets;
            max-width: 40em;
            margin: 0 auto;
            li {
                text-align: left;
            }
            img {
                margin-right: 2em;
                vertical-align: bottom;
                .border;
            }
        }
    }
</style>
