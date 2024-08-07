<template>
  <section class="filtro-campos">
    <div class="filtro-campos__container">
        <div class="filtro-campos__row">
            <div class="filtro-campos__title"><h3>Campos</h3></div>
            <div class="filtro-campos__buttons">
                <button class="btn-apply">Aplicar</button>
                <button class="btn-cancel">Cancelar</button>
            </div>
        </div>
        <div class="filtro-campos__text">
            <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit</div>
        </div>
        <div class="filtro-campos__columnas">
            <div class="filtro-campos__column"></div>
            <div class="filtro-campos__column"></div>
            <div class="filtro-campos__column"></div>
        </div>
    </div>
  </section>
</template>

<style>
    .filtro-campos {
        width: 100%;
        height: auto;
        background-color: #fff;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
    }
    .filtro-campos__container {
        display: flex;
        flex-direction: column;
    }
    .filtro-campos__row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding: 30px 20px;
    }
    .filtro-campos__title{
        width: 50%;
    }
    .filtro-campos__title h3 {
        font-size: 1.2rem;
    }
    .filtro-campos__buttons {
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    .filtro-campos__buttons button{
        padding: 5px 15px;
    }
    .btn-apply {
        background-color: #60605F;
        font-size: 0.8rem;
        color: #fff;
        border-radius: 5px;
    }
    .btn-apply:hover {
        cursor: pointer;
        background-color: #969695;
    }
    .btn-cancel {
        font-size: 0.8rem;
        border: 1px solid #60605F;
        border-radius: 5px;
    }
    .btn-cancel:hover {
        cursor: pointer;
        background-color: #969695;
    }

    .filtro-campos__text {
        width: 100%;
        padding: 0 20px;
    }

    .filtro-campos__columnas {
        width: 100%;
        padding: 30px 20px;
        display: flex;
        flex-direction: row;
    }

    .filtro-campos__column {
        width: 33%;
        height: 300px;
        background-color: #a1a19e;
        border-radius: 3px;
        margin: 0 10px;
    }
</style>