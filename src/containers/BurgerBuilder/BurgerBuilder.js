import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions';

// const INGREDIENT_PRICES = {
//   salad: 0.5,
//   cheese: 0.4,
//   meat: 1.3,
//   bacon: 0.7
// };

export class BurgerBuilder extends Component {
  state = {
    // ingredients: null,
    // totalPrice: 4,
    // purchaseable: false,
    purchasing: false
    // loading: false,
    // error: false
  };

  componentDidMount() {
    // axios
    //   .get('https://react-my-burger-91c85-default-rtdb.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState({ ingredients: response.data });
    //   })
    //   .catch(error => {
    //     this.setState({ error: true });
    //   });
    this.props.onInitIngredients();
  }

  // updatePurchasesState(ingredients) {
  //   const sum = Object.keys(ingredients)
  //     .map(igKey => {
  //       return ingredients[igKey];
  //     })
  //     .reduce((sum, el) => {
  //       return sum + el;
  //     }, 0);
  //   this.setState({ purchaseable: sum > 0 });
  // }
  updatePurchasesState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  // addIngredientHandler = type => {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredints = { ...this.state.ingredients };
  //   updatedIngredints[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredints });
  //   this.updatePurchasesState(updatedIngredints);
  // };

  // removeIngredientHandler = type => {
  //   const oldCount = this.state.ingredients[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredints = { ...this.state.ingredients };
  //   updatedIngredints[type] = updatedCount;
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice - priceDeduction;
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredints });
  //   this.updatePurchasesState(updatedIngredints);
  // };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  // purchaseContinueHandler = () => {
  //   // alert('You continue!');

  //   const queryParams = [];
  //   for (let i in this.state.ingredients) {
  //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
  //   }
  //   queryParams.push('price=' + this.state.totalPrice);
  //   const queryString = queryParams.join('&');
  //   this.props.history.push({
  //     pathname: '/checkout',
  //     search: '?' + queryString
  //   });
  // };
  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  };

  render() {
    const disabledInfo = {
      // ...this.state.ingredients
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    // let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    let burger = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );
    // if (this.state.ingredients) {
    if (this.props.ings) {
      burger = (
        <Aux>
          {/* <Burger ingredients={this.state.ingredients} /> */}
          <Burger ingredients={this.props.ings} />
          <BuildControls
            // ingredientAdded={this.addIngredientHandler}
            // ingredientRemoved={this.removeIngredientHandler}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            // purchaseable={this.state.purchaseable}
            purchaseable={this.updatePurchasesState(this.props.ings)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
            price={this.props.price}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          // ingredients={this.state.ingredients}
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    // if (this.state.loading) {
    //   orderSummary = <Spinner />;
    // }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
