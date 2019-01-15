<template>
    <div class="page-403">
        <ErrorPage
                code="404"
                desc="抱歉，你访问的页面不存在"
        >
            <img slot="img" src="../../assets/image/error/404.svg" alt="">
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
