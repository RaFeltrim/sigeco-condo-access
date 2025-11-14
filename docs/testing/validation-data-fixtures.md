# Validation Test Data

This directory contains test data fixtures used by validation agents.

## Files

- `moradores-test-data.json` - Sample Morador data for testing CRUD operations
- `agendamentos-test-data.json` - Sample Agendamento data for testing workflows
- `funcionarios-test-data.json` - Sample Funcionário data for testing management

## Usage

Test data files are loaded by validation agents to ensure consistent test scenarios across executions.

```typescript
import moradoresData from '@/tests/fixtures/validation-data/moradores-test-data.json';

// Use in tests
const testMorador = moradoresData[0];
```
