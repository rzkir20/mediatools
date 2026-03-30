import { computed, onBeforeUnmount, ref, watch } from "vue";
import { toast } from "vue-sonner";
import type { BankKey, DonationPreset, DonationPresetId } from "~/lib/data";
import { DONATION_PRESETS, GOPAY_NUMBER } from "~/lib/data";

export function useStateDonasi() {
  const amount = ref<number | null>(50000);
  const selectedPresetId = ref<DonationPresetId | null>("50k");
  const isBankModalOpen = ref(false);
  const selectedBank = ref<BankKey>("bca");

  const hasValidAmount = computed(
    () => typeof amount.value === "number" && amount.value >= 10000,
  );

  const formattedAmount = computed(() => {
    if (!hasValidAmount.value || typeof amount.value !== "number") {
      return "";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount.value);
  });

  watch(isBankModalOpen, (open) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
  });

  onBeforeUnmount(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = "";
  });

  function selectPreset(value: number, id: string) {
    amount.value = value;
    selectedPresetId.value = id as DonationPresetId;
  }

  function selectCustom() {
    selectedPresetId.value = "custom";
  }

  function onCustomInput() {
    selectedPresetId.value = "custom";
  }

  function onPresetClick(preset: DonationPreset) {
    if (preset.id === "custom") {
      selectCustom();
      return;
    }

    if (typeof preset.amount === "number") {
      selectPreset(preset.amount, preset.id);
    }
  }

  async function copyGopay() {
    try {
      await navigator.clipboard.writeText(GOPAY_NUMBER);
      toast.success("Nomor GoPay berhasil disalin");
    } catch {
      toast.error("Gagal menyalin nomor GoPay. Coba salin manual.");
    }
  }

  function openBankModal() {
    if (!hasValidAmount.value) return;
    isBankModalOpen.value = true;
  }

  function closeBankModal() {
    isBankModalOpen.value = false;
  }

  return {
    DONATION_PRESETS,
    GOPAY_NUMBER,
    amount,
    selectedPresetId,
    isBankModalOpen,
    selectedBank,
    hasValidAmount,
    formattedAmount,
    onPresetClick,
    onCustomInput,
    copyGopay,
    openBankModal,
    closeBankModal,
  };
}
