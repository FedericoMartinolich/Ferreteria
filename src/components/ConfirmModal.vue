<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="emit('cancel')">
      <div class="modal-card">
        <div class="modal-icon">
          <i class="fa-solid fa-circle-question"></i>
        </div>
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="emit('cancel')">Cancelar</button>
          <button class="modal-btn confirm" @click="emit('confirm')">Aceptar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: '¿Estás seguro?' }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-card {
  background: var(--white);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: modalIn 0.2s ease;
}

.modal-icon {
  font-size: 2.5rem;
  color: var(--orange);
  margin-bottom: 1rem;
}

.modal-message {
  font-size: 1rem;
  font-weight: 500;
  color: var(--navy);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.modal-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.modal-btn.cancel {
  background: var(--gray-100);
  color: var(--gray-600);
  border: 1px solid var(--gray-200);
}

.modal-btn.cancel:hover {
  background: var(--gray-200);
}

.modal-btn.confirm {
  background: var(--navy);
  color: var(--white);
}

.modal-btn.confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 27, 42, 0.3);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
