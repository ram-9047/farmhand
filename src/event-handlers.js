import { getCropFromItemId } from './utils';

const decrementItemFromInventory = (itemId, inventory) => {
  inventory = [...inventory];

  const itemInventoryIndex = inventory.findIndex(({ id }) => id === itemId);

  const { quantity } = inventory[itemInventoryIndex];

  if (quantity > 1) {
    inventory[itemInventoryIndex] = {
      ...inventory[itemInventoryIndex],
      quantity: quantity - 1,
    };
  } else {
    inventory.splice(itemInventoryIndex, 1);
  }

  return inventory;
};

export default {
  /**
   * @param {farmhand.item} item
   */
  handlePurchaseItem(item) {
    const { id, value = 0 } = item;
    const { inventory } = this.state;
    let { money } = this.state;

    if (value > money) {
      return;
    }

    const currentItemSlot = inventory.findIndex(
      ({ id: itemId }) => id === itemId
    );

    if (~currentItemSlot) {
      inventory[currentItemSlot].quantity++;
    } else {
      inventory.push({ id, quantity: 1 });
    }

    money -= value;

    this.setState({ inventory, money });
  },

  /**
   * @param {farmhand.item} item
   */
  handleSellItem(item) {
    const { id, value = 0 } = item;
    const { inventory, money } = this.state;

    this.setState({
      inventory: decrementItemFromInventory(id, inventory),
      money: money + value,
    });
  },

  /**
   * @param {external:React.SyntheticEvent} e
   */
  handleChangeView({ target: { value } }) {
    this.setState({ stageFocus: value });
  },

  /**
   * @param {farmhand.item} item
   */
  handleSelectPlantableItem({ id }) {
    this.setState({ selectedPlantableItemId: id });
  },

  /**
   * @param {number} x
   * @param {number} y
   */
  handlePlotClick(x, y) {
    const { inventory, selectedPlantableItemId } = this.state;

    if (selectedPlantableItemId) {
      const crop = getCropFromItemId(selectedPlantableItemId);
      const { field } = this.state;
      const row = field[y];
      const newRow = row.slice();
      newRow.splice(x, 1, crop);
      const newField = field.slice();
      newField.splice(y, 1, newRow);

      this.setState({
        field: newField,
        inventory: decrementItemFromInventory(
          selectedPlantableItemId,
          inventory
        ),
      });
    }
  },
};
