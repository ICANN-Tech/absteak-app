<script lang="ts">
	import { IndonesiaFlag, KoreaFlag, UnitedKingdomFlag } from '@Components/Global/Atoms/Flag/Index';
    import { LocaleEnum } from '../Enums/Language.enum';

	export let locale: LocaleEnum;
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
	export let className: string = '';
</script>

{#if locale === LocaleEnum.Id}
	<IndonesiaFlag {size} {className} />
{:else if locale === LocaleEnum.En}
	<UnitedKingdomFlag {size} {className} />
{:else if locale === LocaleEnum.Ko}
	<KoreaFlag {size} {className} />
{/if}