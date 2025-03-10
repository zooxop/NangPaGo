package com.mars.app.domain.refrigerator.service;

import static com.mars.common.exception.NPGExceptionType.DUPLICATE_INGREDIENT;
import static com.mars.common.exception.NPGExceptionType.NOT_FOUND_INGREDIENT;
import static com.mars.common.exception.NPGExceptionType.NOT_FOUND_USER;

import com.mars.common.model.ingredient.Ingredient;
import com.mars.app.domain.ingredient.repository.IngredientRepository;
import com.mars.app.domain.refrigerator.dto.RefrigeratorResponseDto;
import com.mars.common.model.refrigerator.Refrigerator;
import com.mars.app.domain.refrigerator.repository.RefrigeratorRepository;
import com.mars.common.model.user.User;
import com.mars.app.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class RefrigeratorService {

    private final RefrigeratorRepository refrigeratorRepository;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;

    public List<RefrigeratorResponseDto> findRefrigerator(Long userId) {
        return refrigeratorRepository.findByUserId(userId)
            .stream()
            .map(RefrigeratorResponseDto::from)
            .toList();
    }

    @Transactional
    public void addIngredient(Long userId, String ingredientName) {
        User user = userRepository.findById(userId)
            .orElseThrow(NOT_FOUND_USER::of);
        Ingredient ingredient = ingredientRepository.findByName(ingredientName)  // TODO: findByName -> findById
            .orElseThrow(NOT_FOUND_INGREDIENT::of);

        checkIngredientDuplicate(user, ingredient);
        saveIngredientToRefrigerator(user, ingredient);
    }

    @Transactional
    public void deleteIngredient(Long userId, String ingredientName) {
        refrigeratorRepository.deleteByUserIdAndIngredientName(userId, ingredientName);
    }

    private void checkIngredientDuplicate(User user, Ingredient ingredient) {
        if (refrigeratorRepository.existsByUserAndIngredient(user, ingredient)) {
            throw DUPLICATE_INGREDIENT.of("이미 냉장고에 동일한 재료가 있습니다.");
        }
    }

    private void saveIngredientToRefrigerator(User user, Ingredient ingredient) {
        refrigeratorRepository.save(Refrigerator.of(user, ingredient));
    }
}
