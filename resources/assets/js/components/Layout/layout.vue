<template>
    <div>
        <div class="tabbable-panel">
            <div class="tabbable-line">
                <!--<page-navigation></page-navigation>-->
                <div class="tab-content">
                    <section class="component">
                        <slot name="section"></slot>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>