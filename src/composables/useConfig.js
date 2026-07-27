import { ref, computed } from "vue";
import { getConfig } from "../services/config.js";

const config = ref(null);
const loading = ref(true);

export function useConfig() {
  async function load() {
    if (config.value) {
      loading.value = false;
      return;
    }
    loading.value = true;
    config.value = await getConfig();
    loading.value = false;
  }

  const c = computed(() => config.value || {});

  const whatsapp = computed(() => c.value.whatsapp || "");
  const whatsappUrl = computed(() =>
    whatsapp.value ? `https://wa.me/${whatsapp.value}` : ""
  );
  const email = computed(() => c.value.email || "");
  const mailtoUrl = computed(() =>
    email.value ? `mailto:${email.value}` : ""
  );
  const instagram = computed(() => c.value.instagram || "");
  const nombre = computed(() => c.value.nombre || "");
  const eslogan = computed(() => c.value.eslogan || "");
  const logo = computed(() => c.value.logo || "");
  const tipoNegocio = computed(() => c.value.tipo_de_negocio || "");
  const diasAtencion = computed(() => c.value.dias_de_atencion || "");
  const horasAtencion = computed(() => c.value.horas_de_atencion || "");
  const coordenadas = computed(() => {
    const raw = c.value.coordenadas || "";
    if (!raw) return null;
    const [lat, lng] = raw.split(",").map(Number);
    return { lat, lng };
  });
  const tituloDecorativo = computed(() => c.value.titulo_decorativo || "");
  const tituloPrincipal = computed(() => c.value.titulo_principal || "");
  const textos = computed(() => [
    c.value.texto1 || "",
    c.value.texto2 || "",
    c.value.texto3 || "",
  ]);
  const caracteristicas = computed(() => [
    c.value.caracteristica1 || "",
    c.value.caracteristica2 || "",
    c.value.caracteristica3 || "",
  ]);
  const numeroFijo = computed(() => c.value.numero_fijo || "");

  return {
    load,
    loading,
    config: c,
    whatsapp,
    whatsappUrl,
    email,
    mailtoUrl,
    instagram,
    nombre,
    eslogan,
    logo,
    tipoNegocio,
    diasAtencion,
    horasAtencion,
    coordenadas,
    tituloDecorativo,
    tituloPrincipal,
    textos,
    caracteristicas,
    numeroFijo,
  };
}
