<template>
    <div class="page-403">
        <ErrorPage
                code="403"
                desc="抱歉，你无权访问该页面"
        >
            <img slot="img" src="../../assets/image/error/403.svg" alt="">
        </ErrorPage>
    </div>
</template>
<script>
    import ErrorPage from '../../components/error/errorPage';
    export default {
        components: {
            ErrorPage
        }
    }
</script>
